import React, { useMemo } from 'react'

import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Link.css'

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export default React.memo(function Link({ target, rel, ...props }: LinkProps) {
  const isLocal = useMemo(() => isLocalLink(props.href), [props.href])
  const linkTarget = useMemo(
    () => (!target && !isLocal ? '_blank' : target || undefined),
    [isLocal, target]
  )
  const linkRel = useMemo(
    () =>
      !isLocal ? new TokenList(rel).add('noopener', 'noreferrer').value : rel,
    [isLocal, rel]
  )

  return (
    <a
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Link',
        (props.onClick || props.href) && 'Link--pointer',
        props.className,
      ])}
      target={linkTarget}
      rel={linkRel}
    />
  )
})

export function isBlankTarget(target?: string | null) {
  return target === '_blank'
}

export function isLocalLink(href?: string | null) {
  return (
    !!href &&
    !href.startsWith('https://') &&
    !href.startsWith('http://') &&
    !href.startsWith('//')
  )
}
