import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { FC, useState } from "react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Home: FC = () => {
  const [amount, setAmount] = useState<number | null>(200);
  const defaultAmounts = [200, 500, 1000];

  const createCheckOutSession = async () => {
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      amount: amount,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) {
      alert(result?.error.message);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-evenly bg-slate-900 p-10">
      <div className="w-1/2">
        <h2 className="text-5xl font-bold text-cyan-300">
          Love what I do? Feel free to support me with a donation!
        </h2>
        <p className="mt-20 text-gray-50">
          Thanks in advance. Each donation of yours means a lot, however little
          it might be!
        </p>
      </div>

      <div className="flex w-96 flex-col items-center space-y-5 rounded-md bg-blue-500 p-10">
        <div className="flex w-full items-center rounded-lg bg-gray-100/30 text-white focus:outline-none">
          <p className="rounded-l-lg bg-gray-300 px-4 py-3 text-lg uppercase text-black transition duration-200">
            INR
          </p>
          <input
            type="number"
            value={amount ? amount : ""}
            className="w-full rounded-lg bg-transparent px-4 py-3 text-white placeholder-gray-50 transition duration-200 focus:outline-none"
            placeholder="Enter Amount"
            onChange={e => setAmount(parseInt(e.target.value))}
          />
        </div>
        <div className="flex w-full items-center space-x-2">
          {defaultAmounts.map(buttonAmount => (
            <button
              className={`${
                amount === buttonAmount ? "bg-cyan-300" : "bg-gray-300"
              }  rounded-full px-6 py-3 transition duration-200`}
              onClick={() => setAmount(buttonAmount)}
              key={buttonAmount}
            >
              ₹{buttonAmount}
            </button>
          ))}
        </div>

        <button
          disabled={!amount}
          role="link"
          onClick={createCheckOutSession}
          className="w-full rounded-lg bg-cyan-300 py-3 text-xl font-semibold hover:bg-cyan-400 "
        >
          <span>Sponsor</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
