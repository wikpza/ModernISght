type Props = {
    children:React.ReactNode,
    className:string,
    type?: 'button' | 'submit' | 'reset';
}

const layout = ({children, className, type='button'}:Props) => {
    return (
        <button className={'CustomButton text-sm '+className} type={type}>
            {children}
        </button>
    )
}
export default layout