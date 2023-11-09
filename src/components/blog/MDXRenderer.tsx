import { Fragment } from 'react';

import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import type { NestedMDXComponents } from 'mdx/types';
import MDXComponents from '~/components/blog/MDXComponents';

function MDXRenderer({ code }: { code: string }) {
  const { default: MdxModuleComponent } = runSync(code, {
    ...runtime,
    baseUrl: import.meta.url,
    Fragment,
    useMDXComponents: () => MDXComponents as NestedMDXComponents,
  });

  return <MdxModuleComponent />;
}

export default MDXRenderer;
