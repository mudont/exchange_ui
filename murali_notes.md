
# Exchange UI

This was made by cloning [this cool project](https://github.com/piotrwitek/react-redux-typescript-realworld-app.git)

Add services in src/services, wire them to src/services/index.ts
Add features in src/features, wire the rootActions and rootEpics to respective index.ts files
Add routes in src/routes, invoke them in App.tsx 

# src/index.tsx
 
- Inserts ```<App>``` into DOM tag root
- service worker unregister
 
## App
 
- initialize _store_ Interesting wiring happens here
  - import rootReducer, rootEpic, services
    from their locations
  - createEpicMiddleware passing services as dependencies
    use types RootAction, RootState and Services for type safety
  - compose them
  - createStore passing rootReducer aand the composed epicMiddleware
    so that the epicMiddleware will receive Redux actions
  - epicMiddleware.run(rootEpic)
- Provider **store**
 
### route component Home
 
    - layout **Main**
 
      + load _Main.css_
      + app-header
      + app-main
 
#### features/.../TodosView
 
##### TodoListActions
 
##### AddTodoForm
 
##### TodoList
 
