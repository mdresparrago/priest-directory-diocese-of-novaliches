/* eslint-disable no-unused-vars */
import { Cookies } from 'quasar'
import { date } from 'quasar'
// import decodeJWT from "jwt-decode";

export const empty = function (arg) {
  return arg === null || arg === undefined || arg === '' || isArrAndEmpty(arg) || isObjAndEmpty(arg)
}

export const isArrAndEmpty = function (arg) {
  return isArr(arg) && arrEmpty(arg)
}

export const isArr = function (arg) {
  return Array.isArray(arg)
}

// For performance, this method does not check if `arr` is really an array.
// Use `isArr` before calling this method, to check if `arr` is really an array.
export const arrEmpty = function (arr) {
  return arr.length === 0
}

export const isObjAndEmpty = function (arg) {
  return isObj(arg) && objEmpty(arg)
}

export const isObj = function (arg) {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null
}

// For performance, this method does not check if `obj` is really an object.
// Use `isObj` before calling this method, to check if `obj` is really an object.
export const objEmpty = function (obj) {
  return Object.keys(obj).length === 0
}

// undefined or null arg will return false
export const isArrAndNotEmpty = function (arg) {
  return isArr(arg) && !arrEmpty(arg)
}

// undefined or null arg will return false
export const isObjAndNotEmpty = function (arg) {
  return isObj(arg) && !objEmpty(arg)
}

export const isStr = function (arg) {
  return typeof arg === 'string'
}

export const isPrimitive = function (val) {
  return (typeof val !== 'object' && typeof val !== 'function') || val === null
}

export const isFlat = function (obj) {
  if (isPrimitive(obj)) throw '`obj` should not be a primitive.'

  for (const key in obj) {
    if (!isPrimitive(obj[key])) return false
  }

  return true
}

export const isNumber = function (arg) {
  return typeof arg === 'number'
}

export const buildHashTable = function (arr, key = 'key') {
  if (arr == null || !Array.isArray(arr)) throw '`arr` argument is required and should be an array.'

  const hash_table = {}
  arr.forEach((obj) => (hash_table[obj[key]] = { ...obj }))
  return hash_table
}

export const buildBreadcrumbs = function (node, hash_table, parent_key = 'parent_key') {
  if (empty(node) || empty(hash_table)) throw 'Incomplete arguments.'

  if (typeof node !== 'object' || Array.isArray(node)) throw '`node` argument should be an object.'
  if (typeof hash_table !== 'object' || Array.isArray(hash_table))
    throw '`hash_table` argument should be an object.'

  let breadcrumbs = []
  let parent_node = hash_table[node[parent_key]] ?? null

  while (parent_node) {
    breadcrumbs.unshift(parent_node.name)
    // Nodes which parent does not exist in the group will be considered root nodes
    if (parent_node[parent_key] && hash_table[parent_node[parent_key]]) {
      parent_node = hash_table[parent_node[parent_key]]
      continue
    }
    parent_node = null
  }

  return breadcrumbs
}

export const buildOptionsArray = function (arr, label, value) {
  if (arr == null || !Array.isArray(arr)) throw '`arr` argument is required and should be an array.'

  for (var result of arr) {
    result.label = result[label]
    result.value = result[value]
  }
  return arr
}

export const generateEntityCode = function (entityName) {
  return entityName.replace(/[aeiou\s\W]/gi, '').toLowerCase()
}

export const cloneArrOfObj = function (arr) {
  // Shallow clone only, make sure objects in array are all flat
  return arr.map((obj) => ({ ...obj }))
}

export const delay = function (ms) {
  return new Promise((res) => setTimeout(() => res(), ms))
}

export const buildTree = function (arr, nodeKey = '', parentNodeKey = '') {
  if (nodeKey === '' || parentNodeKey === '')
    throw 'buildTree: `nodeKey` and `parentNodeKey` arguments are required.'

  const hashTable = {}
  const tree = []

  arr.forEach((node) => (hashTable[node[nodeKey]] = { ...node, children: [] }))

  arr.forEach((node) => {
    if (node[parentNodeKey] && hashTable[node[parentNodeKey]]) {
      hashTable[node[parentNodeKey]].children.push(hashTable[node[nodeKey]])
    } else {
      tree.push(hashTable[node[nodeKey]])
    }
  })

  return tree
}

// Limits and adds ellipsis to a string.
export const addEllipsis = (str, limit) => {
  if (limit < 3) limit = 3

  if (str.length > limit) {
    return str.substring(0, limit - 3) + '...'
  }

  return str
}

// Renders a one-liner presentable text from a FLAT array or object
// IMPORTANT: Make sure that the arg is an object or an array before calling this function
export const presentifyObj = function (arg) {
  let arr = arg

  if (isObj(arr)) {
    arr = []
    for (const key in arg) {
      arr.push(`${key}: ${arg[key]}`)
    }
  }

  // return `[${arr.join(", ")}]`;
  return arr.join(', ')
}

// Returns a one-liner presentable text from a primitive, FLAT array or FLAT object
export const presentify = function (arg) {
  if (arg === undefined || arg === null || arg === '') return ''
  if (typeof arg === 'function') throw '`arg` should not be a function'

  if (isObj(arg) || isArr(arg)) {
    if (!isFlat(arg)) throw '`arg` when an object or an array, should be shallow or flat.'

    return presentifyObj(arg)
  }

  return arg
}

export const stringifyHWBMI = (val) => {
  return `Height: ${val.height}${val.heightUnitCode}, Weight: ${val.weight}${val.weightUnitCode}, BMI: ${val.bmi}`
}

// Renders a delimited string from a primitive, array or an object (nested or flat) using DFS
export const treeToStr = (val, leafDelimiter = ', ') => {
  if (empty(val)) return ''

  const visited = []
  const toVisit = [val]

  while (toVisit.length > 0) {
    const node = toVisit.shift()

    if (!empty(node.bmi)) {
      // for "Height, Weight and BMI" data
      visited.push(stringifyHWBMI(node))
    } else if (!empty(node.bgImageFileName) && !empty(node.strokes)) {
      // for sketch data
      visited.push(`[Sketch]`)
    } else if (!empty(node.allParamsVisible)) {
      // for Diagnostic data
      visited.push(stringifyDiagnostic(node))
    } else if (!empty(node.value) && !empty(node.label)) {
      // for "value and label" data
      visited.push(
        `(${typeof node.value === 'string' ? node.value.toUpperCase() : node.value}) ${node.label}`,
      )
    } else if ((isObj(node) || isArr(node)) && isFlat(node)) {
      visited.push(presentifyObj(node))
    } else if (isPrimitive(node)) {
      // Omit null and undefined nodes
      if (node !== null && node !== undefined) {
        visited.push(node)
      }
    } else {
      for (const key in node) {
        toVisit.unshift(node[key])
      }
    }
  }

  return visited.join(leafDelimiter)
}

export const treeToMultiLinerStr = function (tree, indentSize = 2) {
  if (!isObj(tree)) throw '`tree` should be an object.'

  const indent = Array(indentSize).fill(' ').join('')
  const result = []
  const toVisit = [
    {
      ...tree,
      indent: '',
    },
  ]

  while (toVisit.length > 0) {
    const node = toVisit.shift()

    result.push(`${node.indent}${node.label}: ${presentify(node.value)}`)

    if (isArrAndNotEmpty(node.children)) {
      toVisit.unshift(
        ...node.children.map((n) => {
          n['indent'] = node.indent + indent
          return n
        }),
      )
    }
  }

  return result.join('\n')
}

export const multiLineToOneLine = (str) => {
  return str.replace(/[\n\r]+/g, ', ')
}

export const stringifyDiagnostic = (diagnostic, limitText = false) => {
  // For backward compatibility
  if (isStr(diagnostic)) return multiLineToOneLine(diagnostic)

  const diagStrArr = []

  const diagDate = diagnostic.date
  const diagName = diagnostic.label
  const diagOthers = diagnostic.others ?? ''
  const diagRemarks = diagnostic.remarks ?? ''

  // const diagCreatedBy = diagnostic.createdBy;

  const diagValues = diagnostic.children
    .map((v) => {
      return `${v.label}: ${v.children
        .map((e) => {
          let ret = limitText ? addEllipsis(e.value, 50) : e.value
          if (e.label === 'Reference Range') {
            ret = !empty(e.value) ? ` (${e.value})` : ''
          }
          return ret
        })
        .join('')}`
    })
    .join(', ')

  if (!empty(diagDate)) diagStrArr.push(diagDate)
  if (!empty(diagName)) diagStrArr.push(diagName)
  if (!empty(diagValues)) diagStrArr.push(multiLineToOneLine(diagValues))
  if (!empty(diagOthers)) diagStrArr.push(multiLineToOneLine(diagOthers))
  if (!empty(diagRemarks)) diagStrArr.push(multiLineToOneLine(diagRemarks))
  // if (!empty(diagCreatedBy)) diagStrArr.push(diagCreatedBy);

  return diagStrArr.join(' | ')
}

export const isDate = function (arg) {
  return Object.prototype.toString.call(arg) === '[object Date]'
}

export const formatDate = function (dateDetails = null) {
  if (empty(dateDetails) || empty(dateDetails.date)) return null
  let formatDateRaw = ''
  if (dateDetails.nonQuasarDate) {
    formatDateRaw = new Date(dateDetails.date).toISOString()
  } else {
    formatDateRaw = date.formatDate(dateDetails.date, 'YYYY-MM-DDTHH:mm:ss')
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const formatDate = formatDateRaw.replace(/T/, ' ').replace(/Z/, ' ').substr('0', '16')

  const formattedDate = new Date(formatDate)
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(formattedDate)
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(formattedDate)
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(formattedDate)
  let minute = formattedDate.getMinutes()
  let hour = formattedDate.getHours()

  if (minute < 10) {
    minute = '0' + minute
  }

  let ampm = 'AM'
  if (hour >= 12) {
    if (hour > 12) {
      hour -= 12
    }
    ampm = 'PM'
  }

  const time = `${hour}:${minute}${ampm}`
  const dayName = days[formattedDate.getDay()]

  if (dateDetails.withDayNameWithTime) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year} ${time} `
  } else if (dateDetails.withDayNameOnly) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year}`
  } else if (dateDetails.dateOnly) return `${month.toUpperCase()} ${day}, ${year}`

  return `${month.toUpperCase()} ${day}, ${year} ${time} `
}

export const req = async function (
  method = 'get',
  url,
  accessToken = null,
  payload,
  vuexContext,
  loggedIn,
) {
  if (empty(url) || empty(vuexContext)) throw '`url` and `vuexContext` are required.'

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  }

  if (!empty(payload)) opts['body'] = JSON.stringify(payload)

  try {
    const response = await fetch(url, opts)
    const userLoggedIn = Cookies.has('userDetails')
    if (response.status === 403 && userLoggedIn) {
      await vuexContext.dispatch('users/logoff', true, { root: true })

      vuexContext.commit('users/setUserDetails', null, { root: true })
      vuexContext.commit('users/setUser', null, { root: true })
      Cookies.remove('userDetails')
      Cookies.remove('user')

      return { error: 'Token has expired.' }
    }

    return await response.json()
  } catch (err) {
    console.log('Failed to fetch. Might be a network problem.')
    return {
      error: err,
    }
  }
}

// export const decodeUserJWT = function (jwt) {
//   let user = null;
//   if (jwt) {
//     user = decodeJWT(jwt);
//     user["accessToken"] = jwt;
//   }
//   return user;
// };

// Unicode \u180E is an invisible char to differentiate "value-label string generated by the system" to "actual string from the user"
export const valueLabelDelimiter = ' \u180E--\u180E '

// Objectify string with encoded "value" and "label"
export const parseValueLabel = function (str) {
  const arr = str.split(valueLabelDelimiter)

  if (empty(arr[1]))
    return arr[0] // string
  else
    return {
      value: arr[0],
      label: arr[1],
    }
}

// Stringify object with value and label property
export const stringifyValueLabel = function (obj) {
  return `${
    isStr(obj.value) ? obj.value.toUpperCase() : obj.value
  }${valueLabelDelimiter}${obj.label}`
}

export const formatFullname = function (firstName, middleName = null, lastName, format = 'normal') {
  if (format === 'normal') return `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`
  else if (format === 'formal')
    return `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`
  else if (format === 'normal_short')
    return `${firstName}${middleName ? ` ${__getMiddleInitial(middleName)}` : ''} ${lastName}`
  else if (format === 'formal_short')
    return `${lastName}, ${firstName}${middleName ? ` ${__getMiddleInitial(middleName)}` : ''}`
}

const __getMiddleInitial = function (middleName = null) {
  if (middleName === null || middleName === '') return ''
  return middleName.substring(0, 1) + '.'
}

export const getAge = function (dateString) {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

  return age
}

export function round(num, dec_count = 0) {
  return +(Math.round(num + `e+${dec_count}`) + `e-${dec_count}`)
}

export function parseJsonOptions(opts = null) {
  if (opts === null) return null

  if (
    isStr(opts) &&
    ((opts.startsWith('"') && opts.endsWith('"')) ||
      (opts.startsWith('[') && opts.endsWith(']')) ||
      (opts.startsWith('{') && opts.endsWith('}')))
  )
    return JSON.parse(opts)

  return opts
}

export function getDistinct(arr) {
  if (!isArr(arr)) throw 'Argument should be an array.'
  return [...new Set(arr)]
}

// Used to sort array of strings or objects (with string property to be used for sorting) IN PLACE
export const sortStringArr = (arr, key = null, desc = false) => {
  const ret1 = desc ? -1 : 1
  const ret2 = desc ? 1 : -1

  arr.sort((a, b) =>
    (a[key] ?? a) > (b[key] ?? b) ? ret1 : (a[key] ?? a) < (b[key] ?? b) ? ret2 : 0,
  )
}

// Used to sort array of numbers or objects (with number property to be used for sorting) IN PLACE
export const sortNumberArr = (arr, key = null, desc = false) => {
  arr.sort((a, b) => {
    if (desc) return (b[key] ?? b) - (a[key] ?? a)
    return (a[key] ?? a) - (b[key] ?? b)
  })
}

export const formatForSelectOptions = (arr, label, value) => {
  for (var result of arr) {
    result.label = result[label]
    result.value = result[value]
  }

  return arr
}

export const setInitials = (name) => {
  return name.charAt(0)
}

export const padNumber = (value) => {
  if (value < 10) {
    return '0' + value
  } else {
    return value
  }
}

export const fromAndToDate = (dayDetails) => {
  var days = dayDetails.days // Days you want to subtract
  var currentDay = new Date()
  var last = new Date(currentDay.getTime() - days * 24 * 60 * 60 * 1000)
  var day = last.getDate()
  var month = last.getMonth() + 1
  var year = last.getFullYear()

  const formatYearCurrent = new Intl.DateTimeFormat('en', {
    year: 'numeric',
  }).format(currentDay)
  const formatMonthCurrent = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(currentDay)
  const formatDayCurrent = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(currentDay)
  const fromDate = `${year}/${padNumber(month)}/${padNumber(day)}`
  const toDate = `${formatYearCurrent}/${formatMonthCurrent}/${formatDayCurrent}`
  return {
    fromDate: fromDate,
    toDate: toDate,
  }
}

export const removeElementOnArray = (arr, removeArr, key) => {
  for (var i = arr.length; i--; ) {
    if (arr[i][key] === removeArr) arr.splice(i, 1)
  }
  return arr
}

export const groupBy = function (arr, key) {
  return arr.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}
