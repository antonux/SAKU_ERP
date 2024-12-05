
const Boxes = () => {
  return (
    <div className='flex w-full gap-12 font-medium'>
      {/* Inventory ----------------------------------------------------- */}
      <div className="BOX1 flex flex-col gap-3">
        <h1 className='text-[#504e4e] text-2xl font-semibold'>Inventory</h1>
        {/* inventory #1 box */}
        <div className="bg-[#eff8fa] flex flex-col gap-4 p-5 w-[16rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <div className='flex justify-between w-full'>
            <div className="flex flex-col items-center">
              <p>Total Items</p>
              <h1 className='text-4xl font-medium tracking-wide'>876</h1>
            </div>
            <div className="flex flex-col items-center">
              <p>Out of Stock</p>
              <h1 className='text-4xl font-medium text-red-500 tracking-wide'>2</h1>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <div className="flex flex-col items-center">
              <h1 className='text-2xl font-medium text-gray-500 tracking-wide'>876</h1>
              <p>Tire</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className='text-2xl font-medium text-gray-500 tracking-wide'>876</h1>
              <p>Oil</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className='text-2xl font-medium text-gray-500 tracking-wide'>876</h1>
              <p>Battery</p>
            </div>
          </div>
        </div>
        {/* inventory #2 box */}
        <div className="bg-[#eff8fa] flex flex-col gap-10 p-5 w-[16rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <div className='flex flex-col items-start w-full'>
            <p>Low In Stock</p>
            <h1 className='text-3xl font-medium tracking-wide text-[#f29425]'>6</h1>
          </div>
        </div>
      </div>

      {/* Notification ----------------------------------------------------- */}
      <div className="BOX2 flex flex-col gap-3">
        <h1 className='text-[#504e4e] text-2xl font-semibold'>Notifications</h1>
        {/* inventory #1 box */}
        <div className="bg-[#f8f6f2] flex flex-col gap-4 p-5 w-[20rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <div className='flex justify-between w-full'>
            <div className="flex flex-col items-center">
              <p>Unread</p>
              <h1 className='text-3xl font-medium tracking-wide'>3</h1>
            </div>
            <div className="flex flex-col items-center">
              <p>Urgent</p>
              <h1 className='text-3xl font-medium text-red-500 tracking-wide'>2</h1>
            </div>
            <div className="flex flex-col items-center">
              <p>Ignored</p>
              <h1 className='text-3xl font-medium text-[#868686] tracking-wide'>7</h1>
            </div>
          </div>
        </div>

        <h1 className='text-[#504e4e] text-2xl font-semibold'>Pending Requests</h1>
        {/* inventory #2 box */}
        <div className="bg-[#eff8fa] flex flex-col gap-10 p-5 w-[20rem] h-[8.4rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <div className='flex gap-16 w-full'>
            <div className="flex flex-col gap-4 items-center">
              <p>Restock</p>
              <h1 className='text-3xl font-medium tracking-wide text-[#f3a140]'>1</h1>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <p>Purchase</p>
              <h1 className='text-3xl font-medium tracking-wide text-[#f3a140]'>5</h1>
            </div>
          </div>
        </div>

      </div>

      <div className="BOX3 flex flex-col gap-3">
        <h1 className='text-[#504e4e] text-2xl font-semibold'>Approved Requests</h1>
        {/* inventory #2 box */}
        <div className="bg-[#eff8fa] flex flex-col gap-10 p-5 w-[20rem] rounded-lg border-[1px] border-[#eaf0f2]">
          <div className='flex gap-16 w-full'>
            <div className="flex flex-col items-center">
              <p>Restock</p>
              <h1 className='text-3xl font-medium tracking-wide text-[#868686]'>0</h1>
            </div>
            <div className="flex flex-col items-center">
              <p>Purchase</p>
              <h1 className='text-3xl font-medium tracking-wide text-[#2bd865]'>5</h1>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Boxes;