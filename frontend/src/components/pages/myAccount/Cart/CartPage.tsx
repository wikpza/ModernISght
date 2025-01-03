import AccountLayout from "../../../layout/AccountLayout.tsx";

import CartList from "./CartList.tsx";
import CartItemTotal from "./CartItemTotal.tsx";
import {useGetCart} from "../../../../api/CartAPI.tsx";




const CartPage = () => {
    const {cart, error, isLoading} = useGetCart()

    return (
        <AccountLayout className={''}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Cart</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load Cart. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'w-full flex-1'}>
                    <div className={'flex flex-row justify-between mb-2 w-full flex-1'}>
                        <h3 className={'text-2xl'}>Cart</h3>
                    </div>
                    <CartList cart = {cart} isLoading={isLoading}/>
                    <CartItemTotal cart={cart}/>
                </section>
            }

        </AccountLayout>
    );
};

export default CartPage;