
// creating a class for the api features like sorting, filter, pagination, fields, limit, etc

class ApiFeatures{
    constructor(Model, query){
        this.Model= Model,
        this.query= query
    }
    filter(){
        // checking the query and exclude queries we do not need
        const queryObj= {...this.query}
        const excludedFields= ['sort', 'page', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // advanced filtering(filtering for greater than or less than queries)
        let queryStr= JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
        console.log(JSON.parse(queryStr));

        // add query to TourModel
        this.Model.find(JSON.parse(queryStr));

        return this;
    }
    sort(){
         //sorting
        if(this.query.sort){
            // converting the sort object into an array and then join them together to form a string
            const sortBy= this.query.sort.split(',').join('');
            this.Model= this.Model.sort(sortBy);
            console.log(this.query.sort)
            console.log(sortBy)
        }else{
            // sort by descending order
            this.Model= this.Model.sort('-createdAt')
        }

        return this;
    }
    limitFields(){
        // limiting fields that we want to show(projecting)
        if(this.query.fields){
            const fields= this.query.fields.split(',').join(' ')
            console.log(fields)
            this.Model= this.Model.select(fields)
        }else{
            // exclude  from fetching the __v from mongo db database
            this.Model= this.Model.select('-__v')
        }

        return this;
    }
    paginate(){
        // Pagination
        const page= this.query.page * 1 || 1;
        const limit= this.query.limit * 1 || 100;
        const skip= (page - 1)* limit
        this.Model= this.Model.skip(skip).limit(limit);

        return this;
    }
}

module.exports= ApiFeatures;