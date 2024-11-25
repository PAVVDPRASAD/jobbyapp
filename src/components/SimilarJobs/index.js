import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase, FaStar} from 'react-icons/fa'

import './index.css'

const SimilarJobs = props => {
  const {similar} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similar
  return (
    <li className="item-list-cont">
      <div className="logo-cont">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="comapany-logo"
        />
        <div>
          <h1 className="title-designation">{title}</h1>
          <div className="logo-cont">
            <FaStar color="#fbbf24" size="20px" />
            <p className="rating-num">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="description-paragraph">{jobDescription}</p>
      <div className="job-details-cont">
        <div className="logo-cont">
          <MdLocationOn color="#ffffff" size="20px" />
          <p className="location-name">{location}</p>
          <FaSuitcase color="#ffffff" size="20px" />
          <p className="location-name">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
