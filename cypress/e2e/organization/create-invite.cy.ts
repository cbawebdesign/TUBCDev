import organizationPageObject from '../../support/organization.po';
import { MembershipRole } from '~/lib/organizations/types/membership-role';
import authPo from '../../support/auth.po';

describe(`Create Invite`, () => {
  let email: string;

  before(() => {
    email = createRandomEmail();
  });

  const defaultEmailAddress = authPo.getDefaultUserEmail();

  describe(`Given a user invites a new member`, () => {
    beforeEach(() => {
      cy.signIn(`/settings/organization/members/invite`);
    });

    describe(`When entering current user's email address`, () => {
      it('should disallow the form submission', () => {
        organizationPageObject
          .$getInvitationEmailInput()
          .type(defaultEmailAddress);

        organizationPageObject.$getInviteMembersForm().submit();

        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When entering the same email address multiple times`, () => {
      it('should disallow the form submission', () => {
        const emailAddress = `dupe@makerkit.dev`;

        // here we add the same email into multiple rows
        organizationPageObject
          .$getInvitationEmailInput()
          .clear()
          .type(emailAddress);

        organizationPageObject.$getAppendNewInviteButton().click();
        organizationPageObject.$getInvitationEmailInput(1).type(emailAddress);
        organizationPageObject.$getInviteMembersForm().submit();

        const validity = false;
        getInviteMembersFormValidity().should('equal', validity);
      });
    });

    describe(`When entering a valid email address`, () => {
      it('should allow the form submission', () => {
        organizationPageObject.inviteMember(email, MembershipRole.Member);

        organizationPageObject.$getInvitedMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should('have.text', `Member`);
        });
      });

      it('should be found in InBucket', () => {
        cy.signOutSession();
        cy.reload();

        const mailbox = email.split('@')[0];
        const emailTask = cy.task<UnknownObject>('getInviteEmail', mailbox);

        emailTask.then((email) => {
          expect(email.subject).to.include(
            `You have been invited to join an organization!`,
          );

          expect(email.from).to.include(`<info@makerkit.dev>`);

          const html = (email.body as { html: string }).html;
          const el = document.createElement('html');
          el.innerHTML = html;

          const linkHref = el.querySelector('a')?.getAttribute('href');

          cy.visit(linkHref!, {
            failOnStatusCode: false,
          });

          cy.cyGet('auth-submit-button').should('exist');
        });
      });
    });

    describe(`When the same user is invited again`, () => {
      it('should update the existing invite', () => {
        organizationPageObject.inviteMember(email, MembershipRole.Admin);

        organizationPageObject.$getInvitedMemberByEmail(email).within(() => {
          organizationPageObject.$getRoleBadge().should('have.text', `Admin`);
        });
      });
    });
  });
});

function getInviteMembersFormValidity() {
  return organizationPageObject.$getInviteMembersForm().then(($form) => {
    const form = $form.get()[0] as HTMLFormElement;

    return form.checkValidity();
  });
}

function createRandomEmail() {
  const random = Math.round(Math.random() * 1000);
  return `invited-member-${random}@makerkit.dev`;
}
