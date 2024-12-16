import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import { fetchUserById } from "../../utils/ApiFunctions";


const JobReview = ({ review, onUpdate, onDelete }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.user_id);
    }
  }, []);

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await fetchUserById(review.userId);
      if (data) {
        setName(data.fullName);
      } else {
        setError(error);
      }
    }
    loadReviews();
  }, [review.userId]);

  const formattedDate = formatDistanceToNow(parseISO(review.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md shadow-sm bg-white">
      <div className="flex gap-4">
        {/* Avatar */}
        <img
          src={"/sample_image.jpg"}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />

        {/* Review Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="text-gray-700">
              <h4 className="font-semibold">{name}</h4>
            </div>

            {/* Rating */}
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <FontAwesomeIcon
                  icon={faStar}
                  key={index}
                  className={`w-4 h-4 ${index < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Review Text */}
          <p className="mt-2 text-gray-600">{review.comment}</p>
          <p className="mt-2 text-gray-500 text-sm">{formattedDate}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {review.userId === userId && (
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onUpdate(review.id)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
          >
            Update
          </button>

          <button
            onClick={() => onDelete(review.id)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default JobReview;
