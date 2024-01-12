# Demo Webstore front (WIP)

![A preview image of the search results](https://github.com/Ka-Q/demo-webstore-front/blob/main/docs/DWS_wip.png?raw=true)
![A preview image of the search results](https://github.com/Ka-Q/demo-webstore-front/blob/main/docs/search_found_category.png?raw=true)
![A preview image of the category page](https://github.com/Ka-Q/demo-webstore-front/blob/main/docs/main_category_page.png?raw=true)


## Current features

- A responsive UI that scales for different screen sizes.
- A fuzzy search system for finding both products and catregories containing the searchterm in their name
- Infinite scrolling of search items with automatic fetching from the API
- A "smart" category filter, that understands some subcategories are included under multiple categories (for example, "earbuds" can be under "smart devices" and "audio")
- Price filtering based on user's specified price range
- A five star rating system displayed with stars
- A simple product page / unique product
- Pages for Categories and Sub Categories, that include flexible product showcases ("top rated products in this category")
- User authentication and a warning about an expiring login session

## Planned features
- A local shopping cart, stored in db for logged in users
- A fancier product page
- More diverse product showcase reels
- A frontpage that's not just a gif of a cat...
- Error handling
- An actual way for users to leave product reviews

## Known issues
- If fetching of data fails, errors are not always properly handled
- The links to categories on the search results are not functional

## Running locally

make sure you have set up a local variable in a ```.env.local``` file called REACT_APP_DWS_API_URL. 
The url should point to either the live address or the local address specified in [the DWS API README](https://github.com/Ka-Q/demo-webstore-api#running)

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
