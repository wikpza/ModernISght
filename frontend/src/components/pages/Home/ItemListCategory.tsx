

type Props =
{
    picture:string,
    name:string
}

const itemListCategory = ({ picture, name }: Props) => {
    return (
        <div className="bg-transparent w-full">
            <section className="w-full  h-64 shadow-md object-cover rounded-3xl overflow-hidden">
                <img className="w-full h-full object-cover rounded-3xl" src={picture} alt={name} />
            </section>
            <section className="ml-3 mt-2 text-lg font-medium font-sans">{name}</section>
        </div>
    );
};

export default itemListCategory;
