import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      details: PropTypes.object,
      message: PropTypes.string
    })
  )
}

const defaultProps = {
  errors: []
}

const ErrorBox = ({ errors, ...restProps }) => {
  const renderNestedErrors = () => {
    /**
     * Handles nested errors like
     * errorObj: {
     *  details: {
     *    password: 'Password is too weak',
     *    user: {
     *      email: 'A user with the given email already exists'
     *    }
     *  }
     * }
     */

    const errorItems = []

    const drillDown = (errorObj) => {
      Object.keys(errorObj).forEach((key) => {
        if (Object.prototype.toString.call(errorObj[key]) === '[object Object]') {
          drillDown(errorObj[key])
        } else {
          errorItems.push(
            <li key={key} className="form-errors_item">
              {errorObj[key]}
            </li>
          )
        }
      })
    }

    errors.forEach((errorObj) => {
      drillDown(errorObj.details)
    })

    return errorItems
  }

  if (errors.length < 1) {
    return null
  }

  return (
    <div className="form-errors" {...restProps}>
      <h3 className="form-errors_heading">Error{errors.length > 1 && 's'}</h3>
      <ul className="form-errors_list">{renderNestedErrors()}</ul>
    </div>
  )
}

ErrorBox.propTypes = propTypes
ErrorBox.defaultProps = defaultProps
ErrorBox.displayName = 'ErrorBox'

export default ErrorBox
