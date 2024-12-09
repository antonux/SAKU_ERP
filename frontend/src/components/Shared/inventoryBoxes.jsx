
const Boxes = () => {
  return (
    <div className='flex w-full justify-around gap-3'>
      {/* Categories ----------------------------------------------------- */}
      <div className="BOX1 flex flex-col gap-3 font-medium">
        <div className="bg-[#f8f6f2] flex flex-col gap-1 p-5 w-[13rem] rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Categories</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>3</h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 w-[13rem] rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Total Items</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>800</h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 w-[16rem] rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Total Item Cost</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>₱5,420,677</h1>
        </div>
      </div>
      <div className="BOX1 flex gap-3">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-4 w-[8rem] rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Low Stock</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#f29425]'>6</h1>
        </div>
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-4 w-[8rem] rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Out of Stock</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#ef4c50]'>2</h1>
        </div>
      </div>
    </div>
  )
}

export default Boxes;