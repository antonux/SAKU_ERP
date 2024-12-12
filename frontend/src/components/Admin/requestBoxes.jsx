

const Boxes = () => {
  return (
    <div className='flex w-full justify-around gap-3'>
      {/* Categories ----------------------------------------------------- */}
      <div className="BOX1 flex flex-col gap-3 font-medium w-full">
        <div className="bg-[#f8f6f2] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Total Request Made</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>75</h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Total Cost Inccured</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>₱57,000</h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Approved Requests</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#373737]'>45</h1>
        </div>
      </div>
      <div className="BOX1 flex flex-col gap-3 w-full">
        <div className="bg-[#eff8fa] flex flex-col gap-1 p-5 rounded-lg border-[1px] border-[#eaf0f2]">
            <p>Pending Requests</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#f3a140]'>4</h1>
        </div>
      </div>
    </div>
  )
}

export default Boxes;