import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch, BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'
import {Link} from 'react-router-dom'

import Header from '../Header'

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

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    employmentType: [],
    minimumPackage: '',
    searchInput: '',
    jobs: [],
    profileLoadingStatus: dataFetchStatusConstants.initial,
    jobsLoadingStatus: dataFetchStatusConstants.intial,
  }

  componentDidMount() {
    this.getUserProfileData()
    this.getJobsList()
  }

  getUserProfileData = async () => {
    this.setState({profileLoadingStatus: dataFetchStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({profileLoadingStatus: dataFetchStatusConstants.success})
      this.setState({profileDetails})
    }
    if (!response.ok) {
      this.setState({profileLoadingStatus: dataFetchStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobsLoadingStatus: dataFetchStatusConstants.loading})
    const {employmentType, minimumPackage, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const employmentString = employmentType.join(',')

    console.log(employmentString)

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const response = await fetch(apiUrl, options)

    console.log(response)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const {jobs} = data
      console.log(jobs)
      this.setState({jobsLoadingStatus: dataFetchStatusConstants.success})
      this.setState({jobs})
    }
    if (!response.ok) {
      this.setState({jobsLoadingStatus: dataFetchStatusConstants.failure})
    }
  }

  searchTab = () => (
    <div className="search-input-field-tab-container">
      <input
        className="search-input-field"
        type="search"
        onChange={this.takingSearchInput}
        placeholder="search"
      />
      <button
        className="search-button"
        type="button"
        testid="searchButton"
        onClick={this.getJobsList}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails, profileLoadingStatus} = this.state
    switch (profileLoadingStatus) {
      case dataFetchStatusConstants.loading:
        return (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case dataFetchStatusConstants.failure:
        return (
          <div className="profile-details-failure">
            <button
              className="retry-button"
              type="button"
              onClick={this.getUserProfileData}
            >
              Retry
            </button>
          </div>
        )
      case dataFetchStatusConstants.success:
        return (
          <div className="profile-details-container">
            <div>
              <img src={profileDetails.profileImageUrl} alt="profile" />
            </div>
            <h1 className="profile-name">{profileDetails.name}</h1>
            <p className="profile-short-bio">{profileDetails.shortBio}</p>
          </div>
        )

      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobs, jobsLoadingStatus} = this.state

    console.log(jobs)

    switch (jobsLoadingStatus) {
      case dataFetchStatusConstants.success:
        return jobs.length !== 0 ? (
          <ul className="jobs-details-list-container">
            {jobs.map(each => {
              console.log(each)
              return (
                <Link
                  to={`/jobs/${each.id}`}
                  key={each.id}
                  className="each-job-detail-link"
                >
                  <li className="job-description">
                    <div>
                      <div className="job-detail-image-title-ratings-container">
                        <img src={each.company_logo_url} alt="company logo" />
                        <div className="job-title-star-rating-container">
                          <h1 className="job-title">{each.title}</h1>
                          <div className="star-rating-container">
                            <BsFillStarFill className="star-symbol" />
                            <p className="rating-numeric">{each.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="job-location-type-salary-container">
                        <div className="job-location-type-container">
                          <IoLocationSharp className="location-symbol" />
                          <p className="location-name">{each.location}</p>
                          <BsFillBriefcaseFill className="briefcase-employment-type" />
                          <p>{each.employment_type}</p>
                        </div>
                        <h1>{each.package_per_annum}</h1>
                      </div>
                      <hr className="horizontal-rule" />
                      <h1>Description</h1>
                      <p>{each.job_description}</p>
                    </div>
                  </li>
                </Link>
              )
            })}
          </ul>
        ) : (
          <div className="no-jobs-failure-view-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        )
      case dataFetchStatusConstants.loading:
        return (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case dataFetchStatusConstants.failure:
        return (
          <div className="no-jobs-failure-view-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button
              type="button"
              onClick={this.getJobsList}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }

  takingSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  readingEmploymentTypeChange = id => {
    const {employmentType} = this.state
    if (!employmentType.includes(id)) {
      this.setState({employmentType: [...employmentType, id]}, this.getJobsList)
    } else {
      this.setState(
        {
          employmentType: employmentType.filter(each => each !== id),
        },
        this.getJobsList,
      )
    }
  }

  salaryRangeSelected = id => {
    console.log(id)
    this.setState({minimumPackage: id}, this.getJobsList)
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-page-container">
          <div className="profile-type-salary-range-options-container">
            <div className="small-display-search-tab-container">
              {this.searchTab()}
            </div>

            {this.renderProfileDetails()}

            <hr className="horizontal-rule" />
            <h1 className="type-of-employment-title">Type of Employment</h1>
            <ul className="type-of-employment-options-container">
              {employmentTypesList.map(each => {
                console.log(each)

                const clickedOnAType = () => {
                  this.readingEmploymentTypeChange(each.employmentTypeId)
                }

                return (
                  <li
                    className="option-type-of-employment"
                    key={each.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      onChange={clickedOnAType}
                      className="checkbox-radio-input-field"
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                )
              })}
            </ul>
            <hr className="horizontal-rule" />
            <h1 className="salary-range-title">Salary Range</h1>
            <ul className="salary-range-options-container">
              {salaryRangesList.map(each => {
                console.log(each)
                const selectingSalaryRange = () => {
                  console.log('clicked')
                  this.salaryRangeSelected(each.salaryRangeId)
                }
                return (
                  <li className="option-salary-range" key={each.salaryRangeId}>
                    <input
                      type="radio"
                      name="salaryRangeList"
                      id={each.salaryRangeId}
                      onChange={selectingSalaryRange}
                      className="checkbox-radio-input-field"
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <div className="job-render-container">
              <div className="large-display-search-tab-container">
                {this.searchTab()}
              </div>
              {this.renderJobs()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
