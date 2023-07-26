import { PropsWithChildren } from 'react'
export function Wrapper(props: PropsWithChildren<any>) {
  return <div className="w-full pl-[372px] pr-[100px]">{props.children}</div>
}
