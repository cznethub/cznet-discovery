interface Cznet {
  // Context: CznetContext
  Id: string
  Type: string
  _id: string
  // about: CznetAbout
  additionalType: String
  // author: CznetAuthor
  citation: string[]
  creativeWorkStatus: String
  creator: CznetCreator
  dateCreated: string
  dateModified: string
  datePublished: string
  description: string
  // distribution: CznetDistribution
  // funder: CznetFunder
  // funding: [CznetFunding]
  highlights: CznetHighlight[]
  // identifier: [CznetIdentifier]
  inLanguage: string
  // includedInDataCatalog: CznetIncludedInDataCatalog
  isAccessibleForFree: Boolean
  keywords: string[]
  // license: CznetLicense
  name: string
  // provider: CznetProvider
  // publisher: CznetPublisher
  sameAs: string
  score: number
  // spatialCoverage: CznetSpatialCoverage
  // subjectOf: CznetSubjectOf
  // temporalCoverage: CznetTemporalCoverage
  url: string
}

interface CznetHighlight {
  path: string
  score: number
  texts: CznetHighlightText[]
}

interface CznetHighlightText {
  type: string
  value: string
}

interface CznetCreator {
  List: CznetCreatorList[]
}

interface CznetCreatorList {
  Type: string
  // address: CznetCreatorListAddress
  // affiliation: CznetCreatorListAffiliation
  email: String
  name: String
  url: String
}

interface IHint { 
  type: 'db' | 'local', 
  key: string 
}

interface ISearchFilter {
  publicationYear: { 
    min: number, 
    max: number, 
    isActive: boolean
  },
  dataCoverage: { 
    min: number, 
    max: number, 
    isActive: boolean
  },
  // contentType: {
  //   options: string[],
  //   value: string[]
  // },
  repository: {
    options: string[],
    value: string
  },
  project: {
    // options: string[],
    value: string[]
  }
  creatorName: string
}

interface ISearchParams {
  term: string,
  pageSize: number,
  pageNumber: number,
  publishedStart?: Date,
  publishedEnd?: Date,
  dataCoverageStart?: Date,
  dataCoverageEnd?: Date,
  creatorName?: string,
  providerName?: string
  clusters?: string[],
  sortBy?: 'name' | 'dateCreated'
}

interface ITypeaheadParams {
  term: string,
  pageSize?: number,
  publishedStart?: Date,
  publishedEnd?: Date,
  dataCoverageStart?: Date,
  dataCoverageEnd?: Date,
  creatorName?: string,
  providerName?: string
  project?: string[],
  sortBy?: 'name' | 'dateCreated'
}