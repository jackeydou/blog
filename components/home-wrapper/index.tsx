import { PropsWithChildren } from 'react'
export function Wrapper(props: PropsWithChildren<any>) {
  return <div className="w-full md:pl-[372px] md:pr-[100px]">{props.children}</div>
}
