import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../ui/accordion.tsx";
import {Color} from "../../../../types.ts";

type Props = {
    items: Color[],
    itemHave:Color[]
    name:string,
    setItem:(Item:Color[])=>void
}

function toggleElementById(arr: Color[], item: Color): Color[] {
    // Ищем индекс объекта с заданным _id
    const index = arr.findIndex(element => element._id === item._id);

    if (index !== -1) {
        // Если объект найден, удаляем его
        arr.splice(index, 1);
    } else {

        arr.push(item);  // Можно менять логику добавления объекта
    }

    return arr;
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
                                <div className={`p-3 cursor-pointer rounded  w-fit m-1 min-w-[70px] flex justify-center ${itemHave.findIndex(element => element._id === item._id)===-1? "border-gray-400 border ":"border-2 bg-gray-200 border-gray-600"} `} key = {index}
                                     onClick={()=>{
                                         setItem(toggleElementById(itemHave, item))
                                     }}>
                                    <div className={'mr-2'}>{item.name}</div>
                                    <div className={'w-[20px] h-[20px] border rounded-3xl border-gray-600'} style={{backgroundColor:item.hexCode}}></div>
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