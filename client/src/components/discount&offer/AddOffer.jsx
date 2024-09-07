import React, { useState } from "react";


export default function AddOffer(){
    
const [formData, setFormData] = useState({
    promotionName: "",
    promotionCode: "",
    description: "",
    promotionType: "Percentage Discount                                                             ",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    applicableProducts: "",
    usageLimit:"",
});
const [error, setError] = useState(null)

const handleSubmit = async (e) => {
    e.preventDefault()

    

    const response = await fetch("/api/promotion", {
        method: "POST",
        body: JSON.stringify({
            ...formData,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await response.json()


    if(!response.ok) {
        setError(json.error)
    }
    if(response.ok) {
        setFormData("")
        console.log("new promotion added", json)
    }
}

    return <div className="bg-SecondaryColor p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-DarkColor mb-4">
            Add New Offer
        </h2>

        <div className="flex justify-center items-center min-h-screen">
            <section className="bg-orange-100	p-6 rounded-lg shadow-md w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            Offer Name
                        </label>
                        <input 
                        className="mt-2 p-2 border-spacing-1" 
                        type="text"
                        placeholder="Offer Name"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold"> 
                            Offer Code
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="text"
                        placeholder="Offer Code"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            Description
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="textarea"
                        placeholder="Description"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="type" className="text-1xl font-semibold">
                            Offer Type
                        </label>
                        <select name="type" id="type" className="mt-2 p-2 border-spacing-1">
                            <option value="pDiscount">Percentage Discount</option>
                            <option value="BOGO">Buy One Get One Free</option>
                            <option value="fShipping">Free Shipping</option>
                            <option value="fGift">Free Gift</option>
                        </select>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            Discount Percentage
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="text"
                        placeholder="Discount Percentage"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            Start Date
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="date"
                        placeholder="dd-mm-yyyy"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            End Date
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="date"
                        placeholder="dd-mm-yyyy"/>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="type" className="text-1xl font-semibold">
                            Applicable Products
                        </label>
                        <select name="type" id="type" className="mt-2 p-2 border-spacing-1">
                            <option value="apparel">Apparel</option>
                            <option value="outerwear">Outerwear</option>
                            <option value="kidsclothing">Children's Clothing</option>
                            <option value="formalwear">Formal Wear</option>
                        </select>
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="" className="text-1xl font-semibold">
                            Usage Limit
                        </label>
                        <input
                        className="mt-2 p-2 border-spacing-1" 
                        type="number"
                        placeholder="Usage Limit"/>
                    </div>

                    <button type="submit" className=" bg-rose-400	p-3 rounded-lg px-8 font-bold text-xl align-middle">Add Offer</button>

                    {error && <div className="error">{error}</div>}



                </form>
            </section>
        </div>


    </div>;
}

