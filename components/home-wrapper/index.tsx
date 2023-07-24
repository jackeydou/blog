import { PropsWithChildren } from 'react'
export function Wrapper(props: PropsWithChildren<any>) {
  return <div className="w-full ml-[372px] mr-[100px]">{props.children}</div>
}
