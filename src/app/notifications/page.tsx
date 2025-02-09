type Props = {
    children?: React.ReactNode;
    title: string,
    description: string
};

const notifications = [
    { title: "2/5/2025", description: "Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here." },
    { title: "2/5/2025", description: "Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here." },
    { title: "2/5/2025", description: "Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here. Notification content goes here." }
]

export default function Notifications() {
    return (
        <div className="relative bg-[url('/drone.png')] flex-col bg-cover bg-center w-full flex items-center justify-center">
            <div className="w-[95%] min-h-[55%] backdrop-blur-lg p-5 border-white border-solid border-2 border-b-0 rounded-md">
                {notifications.map(({ title, description }) => (
                    <div>
                        <div className="w-[95%] text-white rounded-md border-white border-solid border-2 p-5 mb-5">
                            <h1>{title}</h1>
                            <p>{description}</p>
                        </div>
                    </div>
                ))}
                {/* <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 flex gap-3 text-lg backdrop-blur-lg p-3 border-white border-solid border-2 rounded-full">
                    {["Unread", "Read", "Saved"].map(text => <div className="px-8 py-2 bg-neutral-500 text-white rounded-full">{text}</div>)}
                </div> */}
                {/* <div className="w-full h-1"> {absolute bottom-0 translate-y-1/2 -translate-x-1/2/}
                    <div className="w-full">a</div>

                    <div className="w-full"></div>
                </div> */}
            </div>
            {/*absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 */}
            <div className="flex w-[95%]">
                <div className="w-full h-1 border-white border-solid border-bottom-2 rounded-full">abc</div>
                <div className="flex gap-3 text-lg backdrop-blur-lg p-3 border-white border-solid border-2 rounded-full">
                    {["Unread", "Read", "Saved"].map(text => <div className="px-8 py-2 bg-neutral-500 text-white rounded-full">{text}</div>)}
                </div>
                <div className="w-full">abc</div>
            </div>
        </div>
    )
}