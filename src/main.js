import {createRouteInfoTemplate} from './components/route-info';
import {createMenuTemplate} from './components/site-menu';
import {createFiltersTemplate} from './components/filters';
import {createSortTemplate} from './components/sort';
import {createRouteDayTemplate, createRouteListTemplate} from './components/route-trip';
import {createWaypointTemplate} from './components/waypoint';
import {createWaypointEditTemplate} from './components/waypoint-edit';

const WAYPOINTS_NUMBER = 3;
const DAYS_NUMBER = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainBlock = document.querySelector(`.trip-main`);
const tripEventsBlock = document.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);
const tripControlsMenuHeadline = tripControlsBlock.querySelector(`h2:first-child`);
const tripControlsFiltersHeadline = tripControlsBlock.querySelector(`h2:last-child`);

render(tripRouteInfoBlock, createRouteInfoTemplate(), `afterbegin`);
render(tripControlsMenuHeadline, createMenuTemplate(), `afterend`);
render(tripControlsFiltersHeadline, createFiltersTemplate(), `afterend`);
render(tripEventsBlock, createSortTemplate());
render(tripEventsBlock, createWaypointEditTemplate(true));
render(tripEventsBlock, createRouteListTemplate());

const tripEventsDaysBlock = tripEventsBlock.querySelector(`.trip-days`);

for (let i = 0; i < DAYS_NUMBER; i++) {
  render(tripEventsDaysBlock, createRouteDayTemplate());

  const tripEventsListBlock = tripEventsDaysBlock.querySelector(`.day:last-child .trip-events__list`);

  for (let j = 0; j < WAYPOINTS_NUMBER; j++) {
    render(tripEventsListBlock, createWaypointTemplate());
  }
}
