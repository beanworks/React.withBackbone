import React from 'react';
import _ from 'lodash';
import Backbone from 'backbone';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function getNonIntersectIn(setA, setB) {
    const presentOnlyInA = new Set(setA);
    const presentOnlyInB = new Set(setB);
    
    for (const elem of presentOnlyInB) {
        if ([...presentOnlyInA].indexOf(elem) !== -1) {
            presentOnlyInB.delete(elem);
            presentOnlyInA.delete(elem);
        }
    }

    return [presentOnlyInA, presentOnlyInB];
}

const withBackbone = (WrappedComponent) => {
    class WithBackbone extends React.Component {
        constructor(props) {
            super(props);

            this.modelListener = new Object();
            _.extend(this.modelListener, Backbone.Events);
            this.setOfModels = this.getSetOfBackbone(props, Backbone.Model);
            this.subscribeTo(this.modelListener, this.setOfModels, 'change');

            this.collectionListener = new Object();
            _.extend(this.collectionListener, Backbone.Events);
            this.setOfCollections = this.getSetOfBackbone(props, Backbone.Collection);
            this.subscribeCollection(this.collectionListener, this.setOfCollections);

            this.debouncedForceUpdate = _.debounce(this.forceUpdateWrapper, 0);

        }

        forceUpdateWrapper() {
            //console.log('Force Updating ', getDisplayName(WrappedComponent));
            this.forceUpdate();
        }

        getSetOfBackbone(props, instance) {
            const result = new Set();
            for (const propName in props) {
                if (this.props[propName] instanceof instance) {
                    result.add(this.props[propName]);
                }
            }

            return result;
        }

        subscribeCollection(listener, setOfCollection) {
            this.subscribeTo(listener, setOfCollection, 'add remove reset sort');
        }

        subscribeTo(listener, setOfObj, event = 'change') {
            for (const obj of setOfObj) {
                listener.listenTo(obj, event, () => {
                    this.debouncedForceUpdate();
            });
            }
        }

        unsubscribeFrom(listener, setOfObj) {
            setOfObj.forEach((obj) => {
                listener.stopListening(obj);
        });
        }

        componentWillReceiveProps(nextProps) {
            const newSetOfModels = this.getSetOfBackbone(nextProps, Backbone.Model);
            const newSetOfCollections = this.getSetOfBackbone(nextProps, Backbone.Collection);

            const [modelsToUnsubscribe, modelsToSubscribe] = getNonIntersectIn(this.setOfModels, newSetOfModels);
            const [collectionsToUnsubscribe, collectionsToSubscribe] = getNonIntersectIn(this.setOfCollections, newSetOfCollections);

            this.subscribeTo(this.modelListener, modelsToSubscribe, 'change');
            this.subscribeCollection(this.collectionListener, collectionsToSubscribe);

            this.unsubscribeFrom(this.modelListener, modelsToUnsubscribe);
            this.unsubscribeFrom(this.collectionListener, collectionsToUnsubscribe);

            this.setOfModels = newSetOfModels;
            this.setOfCollections = newSetOfCollections;
        }

        componentWillUnmount() {
            this.modelListener.stopListening();
            this.collectionListener.stopListening();
        }

        render() {
            return (
                <WrappedComponent ref={(wrappedComponent) => {
                this.wrappedComponent = wrappedComponent;
            }
        }
            {...this.props}/>
        );
        }
    }

    WithBackbone.displayName = `WithBackbone(${getDisplayName(WrappedComponent)})`;

    return WithBackbone;
};

export {withBackbone};
export default withBackbone;
