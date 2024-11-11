import ProfileManager from "../../components/ProfileManager/ProfileManager"
import Searchbarv2 from "../../components/Searchbarv2/Searchbarv2"
import SuitableJobs from "../../components/SuitableJobs/SuitableJobs"

const JobsFit = () => {
    return (
        <>
            <div className="">
                <Searchbarv2/>
            </div>
            <div className="bg-gray-100 min-h-screen w-full">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap lg:flex-nowrap gap-4">
                        <div className="w-full lg:w-2/3">
                            <SuitableJobs />
                        </div>

                        <div className="w-full lg:w-1/3 ml-24">
                            <ProfileManager />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobsFit
