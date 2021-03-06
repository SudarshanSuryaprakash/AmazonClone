import Header from '../components/Header';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectItems, selectTotal } from '../slices/basketSlice';
import CheckoutProduct from '../components/CheckoutProduct';
import Currency from 'react-currency-formatter';
import { useSession } from 'next-auth/client';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
const stripePromise = loadStripe(process.env.stripe_public_key);

const checkout = () => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [session] = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;
    //Call backend to create a checkout session
    const checkoutSession = await axios.post('/api/create-checkout-session', {
      items,
      email: session.user.email,
    });
    //redirect
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) alert(result.error.message);
  };
  return (
    <div className='bg-gray-100'>
      <Header />
      <main className='lg:flex max-w-screen-xl mx-auto'>
        {/* Left */}
        {/* <div className='flex flex-grow p-5 shadow-sm'>
          <Image
            src='https://links.papareact.com/ikj'
            height={250}
            width={1020}
            objectFit='contain'
          />
        </div> */}
        <div className='flex flex-col p-5 space-y-10 bg-white'>
          <Image
            src='https://links.papareact.com/ikj'
            height={250}
            width={1020}
            objectFit='contain'
          />
          <h1 className='text-3xl border-b pb-4'>
            {!items.length ? 'Your basket is empty' : 'Shopping Basket'}
          </h1>
          {items.map((item, i) => (
            <CheckoutProduct
              key={i}
              id={item.id}
              title={item.title}
              rating={item.rating}
              price={item.price}
              description={item.description}
              category={item.category}
              image={item.image}
              hasPrime={item.hasPrime}
            />
          ))}
        </div>
        {/* Right */}
        <div className='flex flex-col bg-white p-10 shadow-md'>
          {items.length > 0 && (
            <>
              <h2 className='whitespace-nowrap'>
                Subtotal ({items.length} items):
                <span className='font-bold'>
                  <Currency quantity={total} currency='GBP' />
                </span>
              </h2>
              <button
                role='link'
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
              >
                {!session ? 'Sign in to Checkout' : 'Proceed to Checkout'}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default checkout;
