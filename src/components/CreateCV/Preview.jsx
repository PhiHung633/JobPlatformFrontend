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
                const [startDate, jobTitle, employer, location, endDate, jobDescription] = item.split(' - ');

                const startDateParts = startDate.split(' ');
                const formattedStartMonth = startDateParts.length >= 2
                    ? `${startDateParts[0]} ${startDateParts[1]}`
                    : startDateParts[0] || '';
                const formattedStartYear = startDateParts[2] && startDateParts[2].match(/\d{4}/) ? startDateParts[2] : '';

                let formattedEndMonth = endDate.includes("Hiện tại") ? "Hiện tại" : '';
                let formattedEndYear = '';
                if (endDate && !endDate.includes("Hiện tại")) {
                    const [endMonth, endYear] = endDate.split(' ');
                    formattedEndMonth = endMonth || '';
                    formattedEndYear = endYear && endYear.match(/\d{4}/) ? endYear : '';
                }

                return {
                    startMonth: formattedStartMonth,
                    startYear: formattedStartYear,
                    jobTitle,
                    employer,
                    location,
                    endMonth: formattedEndMonth,
                    endYear: formattedEndYear,
                    jobDescription: jobDescription || '', // Thêm mô tả công việc
                };
            })
            : [];


        console.log("formattedWorkExperience", formattedWorkExperience);

        setProfile({
            fullName: `${cvFormData.formData?.firstName || ''} ${cvFormData.formData?.surname || ''}`,
            jobPosition: cvFormData.formData?.profession || '',
            address: `${cvFormData.formData?.city || ''}`,
            phone: cvFormData.formData?.phone || '',
            email: cvFormData.formData?.email || '',
            image: selectedImage || '',
            website: portfoliosData.length > 0 ? portfoliosData[0] : 'www.example.com',
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
        };
        console.log("FORMAT", formattedData)

        let result;
        if (id) {
            result = await updateCv(id, formattedData);
        } else {
            result = await createCv(formattedData);
        }
        console.log("RESQQWESA",result)
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

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-y-auto">
            <Sidebar currentStep={6} />

            <div className="ml-8 flex-1 mt-5">
                <h2 className="text-4xl font-bold text-blue-900 mb-2">Review Your Resume</h2>
                <p className="text-gray-600 mb-6">
                    Review and make any final changes to your resume. Then download or email yourself a copy and apply for jobs!
                </p>

                <div id="cv-content" className="flex min-h-[1123px]">
                    {/* Sidebar */}
                    <div className="cv-sidebar w-1/4 bg-blue-900 text-white rounded-lg p-4 shadow-2xl space-y-6">
                        <div className="text-center">
                            <div className="w-40 h-40 mb-5 mx-auto overflow-hidden bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
                                <img
                                    className="w-full h-full object-cover"
                                    src={profile.image}
                                    alt="Profile"
                                />
                            </div>
                            <h3 className="text-2xl font-bold">{profile.name}</h3>
                            <p className="text-sm">{profile.role}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold bg-blue-800 p-2 rounded-t-lg">Contact</h4>
                            <p className="text-sm p-4 space-y-2">
                                <span className="font-semibold">Address:</span> {profile.address} <br />
                                <span className="font-semibold">Phone:</span> {profile.phone} <br />
                                <span className="font-semibold">E-mail:</span> {profile.email} <br />
                                <span className="font-semibold">Website:</span> {profile.website}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold bg-blue-800 p-2 rounded-t-lg">Skills</h4>
                            <div className="p-4">
                                {profile.skills.map((skill, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-semibold text-sm">{skill.name}</p>
                                        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${skill.level * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold bg-blue-800 p-2 rounded-t-lg">Languages</h4>
                            <div className="p-4">
                                {profile.languages.map((language, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-semibold text-sm">{language.title}</p>
                                        {/* <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${skill.level * 10}%` }}
                                            ></div>
                                        </div> */}
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
        </div>
    );
};

export default Preview;
