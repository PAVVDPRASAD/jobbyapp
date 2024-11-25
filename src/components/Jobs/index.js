import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {GoSearch} from 'react-icons/go'

import Header from '../Header'
import JobListItems from '../JobListItems'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const apiStatusJobsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    jobData: [],
    profile: [],
    checkBoxInput: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusJobsConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  formattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getProfileDetails = async () => {
    this.setState({apiJobStatus: apiStatusJobsConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    const profileData = data.profile_details

    const formattedData = {
      name: profileData.name,
      profileImageUrl: profileData.profile_image_url,
      shortBio: profileData.short_bio,
    }
    if (response.ok) {
      this.setState({
        profile: formattedData,
        apiJobStatus: apiStatusJobsConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiStatusJobsConstants.failure,
      })
    }
  }

  renderJobProfileSuccess = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div className="profile-cont">
        <img src={profileImageUrl} alt="profile" key="profile_image_url" />
        <h1 className="profile-heading">{name}</h1>
        <p className="jobrole">{shortBio}</p>
      </div>
    )
  }

  renderJobProfileFailure = () => (
    <div>
      <button type="button" onClick={this.onClickRetry} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderProfileJobViews = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusJobsConstants.success:
        return this.renderJobProfileSuccess()
      case apiStatusJobsConstants.failure:
        return this.renderJobProfileFailure()
      case apiStatusJobsConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusJobsConstants.initial:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const {radioInput, checkBoxInput, searchInput} = this.state
    const checkBoxInputQuery = checkBoxInput.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputQuery}&minimum_package=${radioInput}&search=${searchInput}`

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const formattedJobData = data.jobs.map(eachJob =>
        this.formattedData(eachJob),
      )
      this.setState({
        jobData: formattedJobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  successJobData = () => {
    const {jobData} = this.state
    if (jobData.length !== 0) {
      return (
        <ul className="employe-type-unorder-list">
          {jobData.map(eachJob => (
            <JobListItems key={eachJob.id} jobsList={eachJob} />
          ))}
        </ul>
      )
    }
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs.Try other filters.</p>
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobDetails()
  }

  failureJobData = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry} className="retry-btn">
        Retry
      </button>
    </div>
  )

  onChangeChecked = event => {
    const {checkBoxInput} = this.state
    const inputNotInLit = checkBoxInput.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInLit.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filterData = checkBoxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkBoxInput: filterData}, this.getJobDetails)
    }
  }

  onChangeRadio = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  renderprofileAndSpecification = () => (
    <div className="jobs-specific-cont ">
      {this.renderProfileJobViews()}
      <hr />
      <div>
        <h1 className="features-heading">Type of Employment</h1>
        <ul className="employe-type-unorder-list">
          {employmentTypesList.map(employType => (
            <li
              className="checkbox-container"
              key={employType.employmentTypeId}
            >
              <input
                type="checkbox"
                id={employmentTypesList.employmentTypeId}
                onChange={this.onChangeChecked}
              />
              <label htmlFor={employmentTypesList.employmentTypeId}>
                {employType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <h1 className="features-heading">Salary Range</h1>
        <ul className="employe-type-unorder-list">
          {salaryRangesList.map(employType => (
            <li className="checkbox-container" key={employType.salaryRangeId}>
              <input
                type="radio"
                id={salaryRangesList.salaryRangeId}
                onChange={this.onChangeRadio}
                name="option"
              />
              <label htmlFor={salaryRangesList.salaryRangeId}>
                {employType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    // console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successJobData()
      case apiStatusConstants.failure:
        return this.failureJobData()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.initial:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onClickSearchBtn = () => {
    this.getJobDetails()
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div className="jobs-main-container">
          {this.renderprofileAndSpecification()}
          <div className="all-render-cont">
            <div className="search-cont">
              <input
                type="search"
                placeholder="Search"
                onChange={this.onChangeSearch}
                onKeyDown={this.onEnterSearch}
                value={searchInput}
                className="input-box"
              />
              <button
                aria-label="Submit Form"
                onClick={this.onClickSearchBtn}
                data-testid="searchButton"
                type="button"
                className="search-btn"
                value="search"
              >
                <GoSearch color="#ffffff" size="20" />
              </button>
            </div>
            {this.renderAllViews()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
