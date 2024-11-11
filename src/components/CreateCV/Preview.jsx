import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from './Sidebar/Sidebar';

const Preview = () => {
    const navigate = useNavigate();

    const initialData = JSON.parse(localStorage.getItem("cvFormData")) || {};
    const selectedImage = initialData.selectedImage || '';
    // Initial state with default values, which will be overwritten by localStorage data
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        skills: [],
        summary: '',
        workHistory: [],
        education: [],
        certifications: [],
        hobbies: [],
        languages: [],
        portfolios: [],
    });

    // Load data from localStorage when the component mounts
    useEffect(() => {
        const cvFormData = JSON.parse(localStorage.getItem('cvFormData'));
        const skillsData = JSON.parse(localStorage.getItem('skillsData'));
        const summaryData = localStorage.getItem('summaryData');
        const workHistories = JSON.parse(localStorage.getItem('workHistories'));
        const educationData = JSON.parse(localStorage.getItem('educationData'));
        const certificationsData = JSON.parse(localStorage.getItem('certificationsData'));
        const hobbiesData = JSON.parse(localStorage.getItem('hobbiesData'));
        const languagesData = JSON.parse(localStorage.getItem('languagesData'));
        const portfoliosData = JSON.parse(localStorage.getItem('portfoliosData'));

        // Update the profile state with the loaded data
        setProfile({
            name: `${cvFormData.formData.firstName} ${cvFormData.formData.surname}`,
            role: cvFormData.formData.profession,
            address: `${cvFormData.formData.city}, ${cvFormData.formData.country}, ${cvFormData.formData.postalCode}`,
            phone: cvFormData.formData.phone,
            email: cvFormData.formData.email,
            image: selectedImage,
            website: 'www.example.com',  // You can replace with a real value if available
            skills: skillsData.map(skill => ({ name: skill.name, level: skill.rating * 20 })),  // Assuming rating out of 5
            summary: summaryData,
            workHistory: workHistories.map(work => ({
                date: `${work.startMonth} ${work.startYear} - ${work.endMonth} ${work.endYear}`,
                title: work.jobTitle,
                company: `${work.employer}, ${work.location}`,
            })),
            education: educationData.map(edu => ({
                date: `${edu.graduationMonth} ${edu.graduationYear}`,
                title: `${edu.degree}: ${edu.fieldOfStudy}`,
                institution: `${edu.schoolName}, ${edu.schoolLocation}`,
            })),
            certifications: certificationsData,
            hobbies: hobbiesData,
            languages: languagesData,
            portfolios: portfoliosData,
        });
    }, []);

    const downloadCV = () => {
        const element = document.querySelector("#cv-content");
        element.classList.add("download-mode");

        // Đặt tỉ lệ cho canvas để có độ phân giải cao
        html2canvas(element, { scale: 3, useCORS: true }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

            // Chuyển đổi canvas thành hình ảnh và tính toán chiều cao của ảnh
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Thêm từng phần của hình ảnh vào PDF và chuyển sang trang mới khi hết chỗ
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


    const saveCV = () => {
        localStorage.setItem("cvFormData", JSON.stringify(profile));
        alert("CV đã được lưu!");
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-y-auto">
            <Sidebar currentStep={6} />

            <div className="ml-8 flex-1 mt-5">
                <h2 className="text-3xl font-semibold mb-2">Review your resume</h2>
                <p className="text-gray-600 mb-6">Review and make any final changes to your resume. Then download or email yourself a copy and apply for jobs!</p>

                <div id="cv-content" className="flex min-h-[1123px]">
                    <div className="cv-sidebar w-1/4 bg-blue-900 text-white rounded-lg space-y-4 border border-gray-300 shadow-lg">
                        <div className="text-center p-6">
                            <div className="w-48 h-48 mb-5 overflow-hidden bg-gray-200 rounded-full flex items-center justify-center">
                                <img
                                    className="w-full h-full object-cover"
                                    src={profile.image}  // Set the base64 image source here
                                    alt="Profile"
                                />
                            </div>
                            <h3 className="text-xl font-bold">{profile.name}</h3>
                            <p>{profile.role}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold bg-blue-800 p-2 w-full">Contact</h4>
                            <p className="mt-2 p-4">
                                <span className="font-semibold">Address</span><br /> {profile.address}<br />
                                <span className="font-semibold">Phone</span><br /> {profile.phone}<br />
                                <span className="font-semibold">E-mail</span><br /> {profile.email}<br />
                                <span className="font-semibold">Website:</span><br /> {profile.website}<br />
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold bg-blue-800 p-2 rounded">Skills</h4>
                            {profile.skills.map((skill, index) => (
                                <div key={index} className="mt-2">
                                    <p>{skill.name}</p>
                                    <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-2/3 bg-white p-6 rounded-lg border border-gray-300 shadow-lg">
                        <p className="mb-4">{profile.summary}</p>

                        <section className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Work History</h4>
                            {profile.workHistory.map((job, index) => (
                                <div key={index} className="mb-2">
                                    <p>{job.date}</p>
                                    <p className="font-semibold">{job.title}</p>
                                    <p>{job.company}</p>
                                </div>
                            ))}
                        </section>

                        <section className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Education</h4>
                            {profile.education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <p>{edu.date}</p>
                                    <p className="font-semibold">{edu.title}</p>
                                    <p>{edu.institution}</p>
                                </div>
                            ))}
                        </section>

                        <section className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Certifications</h4>
                            {profile.certifications.map((cert, index) => (
                                <div key={index} className="mb-2">
                                    <p>{cert.date}</p>
                                    <p className="font-semibold">{cert.title}</p>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h4 className="text-xl font-semibold mb-2">Hobbies</h4>
                            <div className="flex space-x-2">
                                {profile.hobbies.map((hobby, index) => (
                                    <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
                                        {hobby}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
                <div className="flex justify-end space-x-5 mt-5 mb-5 mr-5">
                    <button
                        onClick={downloadCV}
                        className="bg-green-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-600 transition"
                    >
                        Tải về
                    </button>
                    <button
                        onClick={saveCV}
                        className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Lưu CV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Preview;
