import {Component} from 'react'
import Cookies from 'js-cookie'
import {
  BsFillStarFill,
  BsFillBriefcaseFill,
  BsBoxArrowUpRight,
} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    jobDetailsFetchedStatus: dataFetchStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetailsContent()
  }

  getJobDetailsContent = async () => {
    this.setState({jobDetailsFetchedStatus: dataFetchStatusConstants.loading})
    console.log(this.props)
    const {match} = this.props
    console.log(match)
    const {params} = match
    console.log(params)
    const {id} = params
    console.log(id)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const jobDetails = data.job_details
      const {skills} = data.job_details
      const lifeAtCompany = data.job_details.life_at_company
      console.log(jobDetails)
      const similarJobs = data.similar_jobs
      console.log(similarJobs)
      this.setState({jobDetails, similarJobs, skills, lifeAtCompany})
      this.setState({jobDetailsFetchedStatus: dataFetchStatusConstants.success})
    }
    if (!response.ok) {
      this.setState({jobDetailsFetchedStatus: dataFetchStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {
      jobDetails,
      similarJobs,
      skills,
      lifeAtCompany,
      jobDetailsFetchedStatus,
    } = this.state
    switch (jobDetailsFetchedStatus) {
      case dataFetchStatusConstants.success:
        return (
          <>
            <div>
              <div className="job-item-details-section">
                <div className="job-detail-image-title-ratings-container">
                  <img
                    src={jobDetails.company_logo_url}
                    alt="job details company logo"
                  />
                  <div className="job-title-star-rating-container">
                    <h1 className="job-title">{jobDetails.title}</h1>
                    <div className="star-rating-container">
                      <BsFillStarFill className="star-symbol" />
                      <p className="rating-numeric">{jobDetails.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="job-location-type-salary-container">
                  <div className="job-location-type-container">
                    <IoLocationSharp className="location-symbol" />
                    <p className="location-name">{jobDetails.location}</p>
                    <BsFillBriefcaseFill className="briefcase-employment-type" />
                    <p>{jobDetails.employment_type}</p>
                  </div>
                  <p>{jobDetails.package_per_annum}</p>
                </div>

                <hr className="horizontal-rule" />
                <div className="description-text-visit-hyperlink-container">
                  <h1>Description</h1>
                  <a href={`${jobDetails.company_website_url}`}>
                    Visit
                    <BsBoxArrowUpRight />
                  </a>
                </div>
                <p>{jobDetails.job_description}</p>
                <h1>Skills</h1>
                <ul className="skills-container">
                  {skills.map(each => {
                    console.log(each)
                    return (
                      <li className="skill-each" key={each.name}>
                        <img src={each.image_url} alt={`${each.name}`} />
                        <h1>{each.name}</h1>
                      </li>
                    )
                  })}
                </ul>

                <h1>Life at Company</h1>
                <div className="life-at-company-description-image">
                  <p>{lifeAtCompany.description}</p>
                  <img
                    className="life-at-company-image"
                    src={lifeAtCompany.image_url}
                    alt="life at company"
                  />
                </div>
              </div>
              <h1>Similar Jobs</h1>
              <ul className="similar-jobs-container">
                {similarJobs.map(each => (
                  <li className="similar-job-section" key={each.id}>
                    <div className="job-detail-image-title-ratings-container">
                      <img
                        src={each.company_logo_url}
                        alt="similar job company logo"
                      />
                      <div className="job-title-star-rating-container">
                        <h1 className="job-title">{each.title}</h1>
                        <div className="star-rating-container">
                          <BsFillStarFill className="star-symbol" />
                          <p className="rating-numeric">{each.rating}</p>
                        </div>
                      </div>
                    </div>

                    <h1>Description</h1>
                    <p>{each.job_description}</p>
                    <div className="job-location-type-container">
                      <IoLocationSharp className="location-symbol" />
                      <p className="location-name">{each.location}</p>
                      <BsFillBriefcaseFill className="briefcase-employment-type" />
                      <p>{each.employment_type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )

      case dataFetchStatusConstants.loading:
        return (
          <div
            className="loader-container"
            testid="loader"
            style={{backgroundColor: '#000000'}}
          >
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
              onClick={this.getJobDetailsContent}
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

  render() {
    const {lifeAtCompany} = this.state
    console.log(lifeAtCompany)

    return (
      <>
        <Header />
        <div className="job-item-details-page">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails