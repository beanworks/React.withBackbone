import {withBackbone} from '../index.js';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtil from 'react-dom/test-utils';
import Backbone from 'backbone';

describe('When using withBackbone', () => {
    class ViewUnderTest extends React.Component {
        constructor(props) {
            super(props);
        }

        instanceMethod() {
            return 'Instance Method was Invoked!';
        }

        render() {
            return (
                <div id="testDiv">
                    <p id="A">{this.props.user.get('name')} - {this.props.job.get('name')}</p>
                    {
                        this.props.cars.models.map((car) => {
                            return (<p key={car.cid}> {car.get('brand')} - {car.get('model')}</p>);
                        })
                    }
                    {
                        this.props.cities.models.map((city) => {
                            return (
                                <p key={city.cid}> {city.get('name')} - {city.get('weather')}</p>
                            );
                        })
                    }
                </div>

            )
        }
    }

    ViewUnderTest.propTypes = {
        cars: PropTypes.instanceOf(Backbone.Collection),
        cities: PropTypes.instanceOf(Backbone.Collection),
        user: PropTypes.instanceOf(Backbone.Model),
        job: PropTypes.instanceOf(Backbone.Model)
    };

    const NewView = withBackbone(ViewUnderTest);

    class ParentComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                user: new Backbone.Model(),
                job: new Backbone.Model(),
                cars: new Backbone.Collection(),
                cities: new Backbone.Collection()
            };
        }

        render() {
            return (<NewView
                {...this.state}
                ref={(viewUnderTest) => {
                    this.viewUnderTest = viewUnderTest;
                }}
            />);
        }
    }

    var element;
    var user;
    var job;
    var cars;
    var cities;
    var rendered;

    beforeEach(() => {
        user = new Backbone.Model({
            name: 'Tom'
        });

        job = new Backbone.Model({
            name: 'developer'
        });

        cars = new Backbone.Collection([
            {brand: 'Ford', model: 'F150'},
            {brand: 'Jeep', model: 'Wrangler'},
            {brand: 'Tesla', model: 'X'},
        ]);

        cities = new Backbone.Collection([
            {name: 'Vancouver', weather: 'rainy'},
            {name: 'Victoria', weather: 'windy'},
            {name: 'Whistler', weather: 'SNOW!!!'},
        ]);

        element = React.createElement(ParentComponent);
        rendered = ReactTestUtil.renderIntoDocument(element);
        rendered.setState({user, job, cars, cities});
    });

    it('Should render match to snapshot', () => {
        const currentElementWithState = rendered.render();
        const tree = ReactTestRenderer.create(currentElementWithState);
        expect(tree).toMatchSnapshot();
    });

    it('Should be able to handle more than one model at a time and trigger rerender when the model changed', () => {
        let p = ReactTestUtil.scryRenderedDOMComponentsWithTag(rendered, 'p')[0];
        expect(p.textContent).toEqual('Tom - developer');

        user.set('name', 'Apple');
        rendered.setState({user});
        p = ReactTestUtil.scryRenderedDOMComponentsWithTag(rendered, 'p')[0];
        expect(p.textContent).toEqual('Apple - developer');

        job.set('name', 'Engineer');
        rendered.setState({job});
        p = ReactTestUtil.scryRenderedDOMComponentsWithTag(rendered, 'p')[0];
        expect(p.textContent).toEqual('Apple - Engineer');
    });


    it('Should be able to handle more than one collection at a time and trigger rerender when the collection resets', () => {
        cars.reset();
        var currentElementWithState = rendered.render();
        var tree = ReactTestRenderer.create(currentElementWithState);
        expect(tree).toMatchSnapshot();

        cities.add({name: 'Montreal', weather: 'sunny'});
        currentElementWithState = rendered.render();
        tree = ReactTestRenderer.create(currentElementWithState);
        expect(tree).toMatchSnapshot();
    });

    it ('Should be able to access wrappedComponent\'s instance method via ref', function() {
        expect(rendered.viewUnderTest).not.toBeFalsy();
        expect(rendered.viewUnderTest.wrappedComponent).not.toBeFalsy();
        expect(rendered.viewUnderTest.wrappedComponent.instanceMethod()).toEqual('Instance Method was Invoked!');
    });

    it('Should register listener for models and collections', function() {
        expect(Object.keys(rendered.viewUnderTest.collectionListener._listeningTo).length).toBe(2);
        expect(Object.keys(rendered.viewUnderTest.modelListener._listeningTo).length).toBe(2);
    });
});