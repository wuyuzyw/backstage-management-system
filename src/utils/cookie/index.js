import Cookies from 'js-cookie'
export const getCookie = (name) => Cookies.get(name)
export const setCookie = (name, value) => Cookies.set(name, value)
export const removeCookie = (name) => Cookies.remove(name)
