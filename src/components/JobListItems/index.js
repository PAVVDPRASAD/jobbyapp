import {Link} from 'react-router-dom'

import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase, FaStar} from 'react-icons/fa'

import './index.css'

const JobListItems = props => {
  const {jobsList} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobsList

  return (
    <Link to={`/jobs/${id}`}>
      <li className="item-list-cont">
        <div className="logo-cont">
          <img
            src={companyLogoUrl}
            alt="company logo"
            key="company_logo_url"
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
        <div className="job-details-cont">
          <div className="logo-cont">
            <MdLocationOn color="#ffffff" size="20px" />
            <p className="location-name">{location}</p>
            <FaSuitcase color="#ffffff" size="20px" />
            <p className="location-name">{employmentType}</p>
          </div>
          <p className="package-annum">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description-heading">Description</h1>
        <p className="description-paragraph">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobListItems
