export class UnitTreeFilter {
  private _path: string | null;
  private _pathParent: string | null;
  private _rootPath: string | null;
  private _level: number | null;
  private _search: string | null;
  private _name: string | null;
  private _id: string | null;

  constructor(
    path: string | null = null,
    pathParent: string | null = null,
    rootPath: string | null = null,
    level: number | null = null,
    search: string | null = null,
    name: string | null = null,
    id: string | null = null,
  ) {
    this._path = path;
    this._pathParent = pathParent;
    this._rootPath = rootPath;
    this._level = level;
    this._search = search;
    this._name = name;
    this._id = id;
  }

  // Getter and Setter for path
  get path(): string | null {
    return this._path;
  }

  set path(value: string | null) {
    this._path = value;
  }

  // Getter and Setter for pathParent
  get pathParent(): string | null {
    return this._pathParent;
  }

  set pathParent(value: string | null) {
    this._pathParent = value;
  }

  // Getter and Setter for rootPath
  get rootPath(): string | null {
    return this._rootPath;
  }

  set rootPath(value: string | null) {
    this._rootPath = value;
  }

  // Getter and Setter for level
  get level(): number | null {
    return this._level;
  }

  set level(value: number | null) {
    this._level = value;
  }

  // Getter and Setter for search
  get search(): string | null {
    return this._search;
  }

  set search(value: string | null) {
    this._search = value;
  }

  // Getter and Setter for name
  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
  }

  // Getter and Setter for id
  get id(): string | null {
    return this._id;
  }

  set id(value: string | null) {
    this._id = value;
  }

  mapToDatabase() {
    return {
      _path: this.path,
      _path_parent: this.pathParent,
      _root_path: this.rootPath,
      _level: this.level,
      _search: this.search,
      _name: this.name,
      _id: this.id,
    }
  }
}
