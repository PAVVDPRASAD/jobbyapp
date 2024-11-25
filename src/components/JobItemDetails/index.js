import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase, FaStar} from 'react-icons/fa'

import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusJobItemDetails = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiJDStatus: apiStatusJobItemDetails.initial,
    jobDetailsData: '',
    lifeAtCompany: '',
    skills: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiJDStatus: apiStatusJobItemDetails.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = ` https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const itemData = await response.json()
    if (response.ok) {
      const jobDetails = {
        companyLogoUrl: itemData.job_details.company_logo_url,
        companyWebsiteUrl: itemData.job_details.company_website_url,
        employmentType: itemData.job_details.employment_type,
        id: itemData.job_details.id,
        jobDescription: itemData.job_details.job_description,
        packagePerAnnum: itemData.job_details.package_per_annum,
        location: itemData.job_details.location,
        rating: itemData.job_details.rating,
        title: itemData.job_details.title,
      }

      const lifeAtCompany = {
        imageUrl: itemData.job_details.life_at_company.image_url,
        description: itemData.job_details.life_at_company.description,
      }

      const skills = itemData.job_details.skills.map(skill => ({
        imageUrl: skill.image_url,
        name: skill.name,
      }))

      const similarJobs = itemData.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobDetailsData: jobDetails,
        lifeAtCompany,
        skills,
        similarJobs,
        apiJDStatus: apiStatusJobItemDetails.success,
      })
    } else {
      this.setState({apiJDStatus: apiStatusJobItemDetails.failure})
    }
  }

  topJobDetails = jobDetails => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div>
        <div className="logo-cont">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
        <div>
          <h1 className="description-heading">Description</h1>
          <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
            Visit
          </a>
        </div>
        <p className="description-paragraph">{jobDescription}</p>
      </div>
    )
  }

  middleJobDetails = jobDetails => {
    const {name, imageUrl} = jobDetails
    return (
      <li key={name} className="skill-list-conta">
        <img src={imageUrl} alt={name} className="skill-image" />
        <p>{name}</p>
      </li>
    )
  }

  bottomJobDetails = jobDetails => {
    const {description, imageUrl} = jobDetails
    return (
      <div>
        <p>{description}</p>
        <img src={imageUrl} alt="life at company" />
      </div>
    )
  }

  renderJobDetailsSuccess = () => {
    const {jobDetailsData, lifeAtCompany, skills, similarJobs} = this.state

    return (
      <div>
        <div className="item-list-cont">
          {this.topJobDetails(jobDetailsData)}
          <h1>Skills</h1>
          <ul>{skills.map(eachSkill => this.middleJobDetails(eachSkill))}</ul>
          <h1>Life at Company</h1>
          {this.bottomJobDetails(lifeAtCompany)}
        </div>

        <div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(similar => (
              <SimilarJobs key={similar.id} similar={similar} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobDetailsFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.getJobItemDetails}
        className="retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiJDStatus} = this.state

    switch (apiJDStatus) {
      case apiStatusJobItemDetails.success:
        return this.renderJobDetailsSuccess()
      case apiStatusJobItemDetails.failure:
        return this.renderJobDetailsFailure()
      case apiStatusJobItemDetails.inProgress:
        return this.renderLoaderView()
      case apiStatusJobItemDetails.initial:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}
export default JobItemDetails
