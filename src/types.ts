interface Schemaorg {
  Context: SchemaorgContext
  Id: string
  Type: string
  _id: string
  // about: SchemaorgAbout
  additionalType: string
  // author: SchemaorgAuthor
  citation: string[]
  creativeWorkStatus: string
  // creator: SchemaorgCreator
  dateCreated: string
  dateModified: string
  datePublished: string
  description: string
  // distribution: SchemaorgDistribution
  // funder: SchemaorgFunder
  // funding: [SchemaorgFunding]
  highlights: [SchemaorgHighlight]
  // identifier: [SchemaorgIdentifier]
  inLanguage: String
  // includedInDataCatalog: SchemaorgIncludedInDataCatalog
  isAccessibleForFree: Boolean
  keywords: string[]
  // license: SchemaorgLicense
  name: string
  // provider: SchemaorgProvider
  // publisher: SchemaorgPublisher
  sameAs: string
  // spatialCoverage: SchemaorgSpatialCoverage
  // subjectOf: SchemaorgSubjectOf
  temporalCoverage: string
  url: string
}

interface SchemaorgContext {
  Vocab: string
  datacite: string
}

interface SchemaorgHighlight {
  path: string
  score: number
  texts: SchemaorgHighlightText[]
}

interface SchemaorgHighlightText {
  type: string
  value: string
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
  contentType: {
    options: string[],
    value: string[]
  },
  repository: {
    options: string[],
    value: string
  }
}