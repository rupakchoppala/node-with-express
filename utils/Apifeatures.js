export class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query; // Mongoose query object
      this.queryStr = queryStr; // Query string from the request
    }
  
    filter() {
      let queryString = JSON.stringify(this.queryStr); // Use this.queryStr instead of req.query
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      const queryObj = JSON.parse(queryString);
  
      // Remove special fields (sort, fields, page, limit)
      delete queryObj.sort;
      delete queryObj.fields;
      delete queryObj.page;
      delete queryObj.limit;
  
      // Apply filters to the query
      this.query = this.query.find(queryObj);
  
      return this;
    }
  
    sort() {
      if (this.queryStr.sort) {
        const sortFields = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortFields);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 10;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  