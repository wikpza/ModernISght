
type Props = {
    name:string,
    imgSrc:string
}

const ProductViewElement = ({name, imgSrc}:Props) => {
    return (
        <div className={'bg-transparent '}>
            <section className=" w-full max-w-xs h-auto shadow-md object-cover rounded-3xl" ><img className={' rounded-3xl'} src={imgSrc}/></section>
            <section className={'ml-3 mt-2 text-lg font-medium font-sans'}>{name}</section>
        </div>
    );
};

export default ProductViewElement;