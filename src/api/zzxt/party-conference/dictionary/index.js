import request from '@/utils/request'
const api = 'partyConference/'
import { cached_data } from '@/utils/cache'

const urlConferType = `${api}conferTypeDict`
export function conferType() {
  return cached_data(`${urlConferType}`, () =>
    request.get(urlConferType)
  )
}

const urlConferContentType = `${api}ConferRecordContentTypeDict`
export function conferRecordContentType() {
  return cached_data(`${urlConferContentType}`, () =>
    request.get(urlConferContentType)
  )
}

const urlConferRecordType = `${api}ConferRecordTypeDict`
export function conferRecordType() {
  return cached_data(`${urlConferRecordType}`, () =>
    request.get(urlConferRecordType)
  )
}

const urlPartyGroupType = `${api}PartyGroupTypeDict`
export function partyGroupType() {
  return cached_data(`${urlPartyGroupType}`, () =>
    request.get(urlPartyGroupType)
  )
}
