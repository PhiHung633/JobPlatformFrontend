import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createCv, updateCv } from '../../utils/ApiFunctions';
import Sidebar from './Sidebar/Sidebar';

const Preview = () => {
    const navigate = useNavigate();

    const initialData = JSON.parse(localStorage.getItem("cvFormData")) || {};
    const selectedImage = initialData.selectedImage || '';
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        skills: [],
        summary: '',
        workExperience: [],
        education: [],
        certifications: [],
        hobbies: [],
        languages: [],
        portfolios: [],
    });

    // State for managing sidebar color and color picker visibility
    const [sidebarColor, setSidebarColor] = useState('#1e3a8a'); // Default blue-900
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        const cvFormData = JSON.parse(localStorage.getItem('cvFormData')) || {};
        const skillsData = localStorage.getItem('skillsData') ? localStorage.getItem('skillsData').split('; ') : [];
        const summaryData = localStorage.getItem('summaryData') || '';
        const storedEducationData = localStorage.getItem('educationData') || '';
        const certificationsData = localStorage.getItem('certificationsData') ? localStorage.getItem('certificationsData').split('; ') : [];
        const hobbiesData = localStorage.getItem('hobbiesData') ? localStorage.getItem('hobbiesData').split('; ') : [];
        const languagesData = localStorage.getItem('languagesData') ? localStorage.getItem('languagesData').split('; ') : [];
        const portfoliosData = localStorage.getItem('portfoliosData') ? localStorage.getItem('portfoliosData').split('; ') : [];
        const workHistoriesData = localStorage.getItem('workHistories') || '';
        const formattedEducationData = storedEducationData
            ? storedEducationData.split('; ').map(item => {
                const [date, title, institution] = item.split(' - ');
                return { date, title, institution };
            })
            : [];

        const formattedSkillsData = skillsData.map(skill => {
            const [name, level] = skill.split(' - ');
            return { name, level: parseInt(level) || 50 };
        });
        console.log("HISTORY", workHistoriesData)
        const formattedWorkExperience = workHistoriesData
            ? workHistoriesData.split('; ').map(item => {
                const parts = item.split(' - ');

                // Ensure we have enough parts before destructuring
                if (parts.length < 6) {
                    console.error("Invalid work experience string format:", item);
                    return null; // Or handle the error as appropriate
                }

                const [startDate, jobTitle, employer, location, endDateString, jobDescription] = parts;

                const startDateParts = startDate.split(' ');
                const formattedStartMonth = startDateParts.length >= 2
                    ? `${startDateParts[0]} ${startDateParts[1]}`
                    : startDateParts[0] || '';
                const formattedStartYear = startDateParts[2] && startDateParts[2].match(/\d{4}/) ? startDateParts[2] : '';

                let formattedEndMonth = '';
                let formattedEndYear = '';

                if (endDateString) {
                    if (endDateString.includes("Hiện tại")) {
                        formattedEndMonth = "Hiện tại";
                        formattedEndYear = ''; // No year for "Hiện tại"
                    } else {
                        // Split the endDateString (e.g., "Tháng 8 2014")
                        const endDateParts = endDateString.split(' ');
                        if (endDateParts.length >= 2) {
                            formattedEndMonth = `${endDateParts[0]} ${endDateParts[1]}`;
                            formattedEndYear = endDateParts[2] && endDateParts[2].match(/\d{4}/) ? endDateParts[2] : '';
                        } else if (endDateParts.length === 1) {
                            formattedEndMonth = endDateParts[0];
                        }
                    }
                }

                return {
                    startMonth: formattedStartMonth,
                    startYear: formattedStartYear,
                    jobTitle,
                    employer,
                    location,
                    endMonth: formattedEndMonth,
                    endYear: formattedEndYear,
                    jobDescription: jobDescription || '',
                };
            })
                .filter(item => item !== null) // Remove any null items if errors occurred
            : [];

        console.log("formattedWorkExperience", formattedWorkExperience);

        setProfile({
            fullName: `${cvFormData.formData?.surname || ''} ${cvFormData.formData?.firstName || ''}`,
            jobPosition: cvFormData.formData?.profession || '',
            address: `${cvFormData.formData?.city || ''}`,
            phone: cvFormData.formData?.phone || '',
            email: cvFormData.formData?.email || '',
            image: selectedImage || '',
            website: portfoliosData.length > 0 ? portfoliosData[0] : '',
            skills: formattedSkillsData,
            summary: summaryData,
            workExperience: formattedWorkExperience,
            education: formattedEducationData,
            certifications: certificationsData.map(cert => ({ title: cert, date: '' })),
            hobbies: hobbiesData.map(hob => ({ title: hob })),
            languages: languagesData.map(lan => ({ title: lan })),
            portfolios: portfoliosData.map(portfolio => ({ title: portfolio })),
        });
        console.log("PROFIILEE", profile)
    }, []);

    const downloadCV = () => {
        const element = document.querySelector("#cv-content");
        element.classList.add("download-mode");

        html2canvas(element, { scale: 3, useCORS: true }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
                position -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                }
            }

            pdf.save('my-cv.pdf');
            element.classList.remove("download-mode");
        });
    };

    const handleCreateCv = async (cvData) => {
        const selectedCvItem = JSON.parse(localStorage.getItem('selectedCvData'));
        const id = selectedCvItem?.id;
        console.log("workne", cvData.workExperience)
        const formattedData = {
            ...cvData,
            skills: cvData.skills
                .map(skill => `${skill.name} - ${skill.level}`)
                .join("; "),
            imageCV: cvData.image,
            hobby: cvData.hobbies.map(hob => hob.title).join("; "),

            education: cvData.education
                .map(edu => `${edu.date} - ${edu.title} - ${edu.institution}`)
                .join("; "),

            certifications: cvData.certifications.map(cert => cert.title).join("; "),

            workExperience: cvData.workExperience
                .map(work =>
                    `${work.startMonth} ${work.startYear} - ${work.jobTitle} - ${work.employer} - ${work.location} - ${work.endMonth} ${work.endYear} - ${work.jobDescription || ''}`
                )
                .join("; "),

            languageSkill: cvData.languages.map(lang => lang.title).join("; "),
            portfolio: cvData.portfolios.map(portfolio => portfolio.title).join("; "),
            summary: cvData.summary
        };
        console.log("FORMAT", formattedData)

        let result;
        if (id) {
            result = await updateCv(id, formattedData);
        } else {
            result = await createCv(formattedData);
        }
        console.log("RESQQWESA", result)
        if (result.status === 403) {
            console.error("Failed to save CV:", result.error);
            alert(`Error saving CV: ${result.error.message}`);
        } else {
            alert("CV saved successfully!!!");

            localStorage.removeItem('selectedCvData');
            localStorage.removeItem('certificationsData');
            localStorage.removeItem('cvFormData');
            localStorage.removeItem('educationData');
            localStorage.removeItem('hobbiesData');
            localStorage.removeItem('languagesData');
            localStorage.removeItem('portfoliosData');
            localStorage.removeItem('skillsData');
            localStorage.removeItem('summaryData');
            localStorage.removeItem('workHistories');
            navigate("/cv-cua-toi");
        }
    };
    console.log("PRO", profile)

    const handleColorChange = (e) => {
        setSidebarColor(e.target.value);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-y-auto relative">
            <Sidebar currentStep={6} />

            <div className="ml-8 flex-1 mt-5">
                <h2 className="text-4xl font-bold text-blue-900 mb-2">Review Your Resume</h2>
                <p className="text-gray-600 mb-6">
                    Review and make any final changes to your resume. Then download or email yourself a copy and apply for jobs!
                </p>

                <div id="cv-content" className="flex min-h-[1123px]">
                    {/* Sidebar */}
                    <div
                        className="cv-sidebar w-1/4 text-white rounded-lg p-4 shadow-2xl space-y-6"
                        style={{ backgroundColor: sidebarColor }} // Apply dynamic color here
                    >
                        <div className="text-center">
                            <div className="w-40 h-40 mb-5 mx-auto overflow-hidden bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
                                <img
                                    className="w-full h-full object-cover"
                                    src={profile.image}
                                    alt="Profile"
                                />
                            </div>
                            <h3 className="text-2xl font-bold">{profile.fullName}</h3> {/* Changed to fullName */}
                            <p className="text-sm">{profile.jobPosition}</p> {/* Changed to jobPosition */}
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold p-2 rounded-t-lg" style={{ backgroundColor: darkenColor(sidebarColor, 20) }}>Contact</h4> {/* Darken sidebar color for heading */}
                            <p className="text-sm p-4 space-y-2">
                                <span className="font-semibold">Address:</span> {profile.address} <br />
                                <span className="font-semibold">Phone:</span> {profile.phone} <br />
                                <span className="font-semibold">E-mail:</span> {profile.email} <br />
                                {profile.website && (
                                    <span className="font-semibold">
                                        Website: {profile.website}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold p-2 rounded-t-lg" style={{ backgroundColor: darkenColor(sidebarColor, 20) }}>Skills</h4>
                            <div className="p-4">
                                {profile.skills.map((skill, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-semibold text-sm">{skill.name}</p>
                                        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${skill.level * 20}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold p-2 rounded-t-lg" style={{ backgroundColor: darkenColor(sidebarColor, 20) }}>Languages</h4>
                            <div className="p-4">
                                {profile.languages.map((language, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-semibold text-sm">{language.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className=" w-2/3 bg-white p-8 rounded-lg border border-gray-200 shadow-lg space-y-8">
                        <p className="mb-4 text-gray-700 leading-relaxed">{profile.summary}</p>

                        {/* Work History */}
                        {profile.workExperience.length > 0 && (
                            <section>
                                <h4 className="text-xl font-semibold mb-2 text-blue-900">Work History</h4>
                                <div className="space-y-4">
                                    {profile.workExperience.map((job, index) => (
                                        <div key={index} className="border-b pb-2">
                                            <div className="flex items-center space-x-3 text-gray-500">
                                                <p>{job.startMonth} {job.startYear}</p>
                                                <span>-</span>
                                                <p>{job.endMonth} {job.endYear}</p>
                                            </div>
                                            <p className="font-semibold text-lg">{job.jobTitle}</p>
                                            <p className="text-sm">{job.employer}</p>
                                            <p className="text-gray-600">
                                                {job.jobDescription}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {profile.education.length > 0 && (
                            <section>
                                <h4 className="text-xl font-semibold mb-2 text-blue-900">Education</h4>
                                <div className="space-y-4">
                                    {profile.education.map((edu, index) => (
                                        <div key={index} className="border-b pb-2">
                                            <p className="flex items-center space-x-3 text-gray-500">{edu.date}</p>
                                            <p className="text-lg">{edu.title}</p>
                                            <p className="text-sm">{edu.institution}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {profile.certifications.length > 0 && (
                            <section>
                                <h4 className="text-xl font-semibold mb-2 text-blue-900">Certifications</h4>
                                <div className="space-y-4">
                                    {profile.certifications.map((cert, index) => (
                                        <div key={index} className="border-b pb-2">
                                            <p>{cert.date}</p>
                                            <p className="">{cert.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {profile.hobbies && profile.hobbies.length > 0 && (
                            <section>
                                <h4 className="text-xl font-semibold mb-2 text-blue-900">Hobbies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.hobbies.map((hobby, index) => (
                                        <span key={index} className="bg-gray-100 text-sm px-3 py-1 rounded-full">
                                            {hobby.title}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 mb-5 mr-24">
                    <button
                        onClick={downloadCV}
                        className="bg-green-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-green-700 transition"
                    >
                        Tải về
                    </button>
                    <button
                        onClick={() => handleCreateCv(profile)}
                        className="bg-yellow-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-yellow-700 transition"
                    >
                        Lưu CV
                    </button>
                </div>
            </div>

            {/* Floating button for color picker */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    title="Change Sidebar Color"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343V4a2 2 0 012-2h7a2 2 0 012 2v12a2 2 0 01-2 2h-2.343m-6.068.562L10 16m3-3h.01"
                        />
                    </svg>
                </button>

                {showColorPicker && (
                    <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                        <label htmlFor="color-picker" className="block text-gray-700 text-sm font-bold mb-2">
                            Chọn màu Sidebar:
                        </label>
                        <input
                            type="color"
                            id="color-picker"
                            value={sidebarColor}
                            onChange={handleColorChange}
                            className="w-24 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;

// Helper function to darken a color (for heading backgrounds)
function darkenColor(hex, percent) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, r - (r * percent) / 100);
    const newG = Math.max(0, g - (g * percent) / 100);
    const newB = Math.max(0, b - (b * percent) / 100);

    return `#${(Math.round(newR).toString(16).padStart(2, '0'))}${(Math.round(newG).toString(16).padStart(2, '0'))}${(Math.round(newB).toString(16).padStart(2, '0'))}`;
}