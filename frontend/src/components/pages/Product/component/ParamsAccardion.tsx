import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../ui/accordion.tsx";
import {Item} from "../../admin/Brand/element/ItemList.tsx";

type Props = {
    items:Item[],
    itemHave:Item[]
    name:string,
    setItem:(Item:Item[])=>void
}

function toggleElementById(arr: Item[], item: Item): Item[] {
    // Ищем индекс объекта с заданным _id
    const index = arr.findIndex(element => element._id === item._id);

    if (index !== -1) {

        return arr.filter(existingItem => existingItem._id !== item._id);
    } else {

        return [...arr, item]
    }

}


const ParamsAccardion = ({name, items, setItem, itemHave}:Props) => {
    return (
        <div>
            <Accordion type="single" collapsible className={""}>
                <AccordionItem value="item-1" className={"border-gray-600"}>
                    <AccordionTrigger className={"text-lg font-normal"}>{name}</AccordionTrigger>
                    <AccordionContent className={" flex-wrap flex"}>
                        {items.length === 0?
                        <div>{`haven't added any ${name}`} </div>
                        :
                        items.map(((item, index)=>(
                            <div className={`p-3 cursor-pointer rounded  w-fit m-1 min-w-[70px] text-center ${itemHave.findIndex(element => element._id === item._id)===-1? "border-gray-400 border ":"border-2 bg-gray-200 border-gray-600"} `} key = {index}
                            onClick={()=>{
                                setItem(toggleElementById(itemHave, item))
                            }}>
                                {item.name}
                            </div>
                        )))
                        }
                        <div>

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ParamsAccardion;