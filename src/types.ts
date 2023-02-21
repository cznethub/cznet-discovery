interface IHint { 
  type: 'db' | 'local', 
  key: string 
}

interface ISearchParams {
  term: string,
  pageSize: number,
  pageNumber: number,
  sortBy?: 'name' | 'dateCreated'
}

interface ITypeaheadParams {
  term: string,
  pageSize?: number,
  sortBy?: 'name' | 'dateCreated'
}