import HistoryApplies from "../../components/HistoryApplies/HistoryApplies"
import ProfileManager from "../../components/ProfileManager/ProfileManager"

const JobApplied = () => {
    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap lg:flex-nowrap gap-4">
                    <div className="w-full lg:w-2/3">
                        <HistoryApplies />
                    </div>

                    <div className="w-full lg:w-1/3 ml-24">
                        <ProfileManager />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplied;



