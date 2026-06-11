import { Query } from 'mongoose';

type QueryString = {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  category?: string;
  price?: string;
};

class APIFeatures<T> {
  query: Query<T[], T>;
  queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj: { [key: string]: any } = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filterConditions: any = {};

    // Category filter
    if (this.queryString.category && this.queryString.category !== 'All') {
      filterConditions.category = this.queryString.category;
    }

    // Price filter
    if (this.queryString.price) {
      switch (this.queryString.price) {
        case 'under50':
          filterConditions.price = { $lt: 50 };
          break;
        case '50to100':
          filterConditions.price = { $gte: 50, $lte: 100 };
          break;
        case '100to200':
          filterConditions.price = { $gt: 100, $lte: 200 };
          break;
        case 'over200':
          filterConditions.price = { $gt: 200 };
          break;
      }
    }

    // Advanced filtering (e.g., ?price[gte]=10)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const advancedFilter = JSON.parse(queryStr);

    this.query = this.query.find({ ...advancedFilter, ...filterConditions });

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ') + ' _id';
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate(): this {
    if (!this.queryString.page || !this.queryString.limit) return this;

    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
