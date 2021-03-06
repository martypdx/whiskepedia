import Component from '../Component.js';
import { makeFavorite, removeFavorite } from '../../services/whiskey-api.js';
import store from '../../services/store.js';

class WhiskeyItem extends Component {
    onRender(li) {
        const whiskey = this.props.whiskey;
        const flavorCategories = this.props.flavorCategories;
        const removedFavorite = this.props.removedFavorite;

        const favoriteButton = li.querySelector('.favorite-star');
        favoriteButton.addEventListener('click', () => {
            whiskey.isFavorite = !whiskey.isFavorite;
            if(!store.hasToken()) {
                alert('You must Log in for that . . . ');
                window.location = 'auth.html';
            }
            if(whiskey.isFavorite) {
                makeFavorite(whiskey);
            }
            else {
                removeFavorite(whiskey.id);
                setTimeout(() => {
                    if(removedFavorite) {
                        this.rootElement.remove();
                    }
                }, 300);
            }
            favoriteButton.classList.toggle('is-favorite');
        });

        function createChart(flavorCategories, whiskey) {
            const chartCategories = flavorCategories.map((item) => item.category);
            const chartMagnitudes = flavorCategories.map((item) => {
                const categoryFlavorsStr = item.flavors.join(' ');
                return whiskey.flavorCountsNormalized.reduce((acc, count, i) => {
                    if(categoryFlavorsStr.includes(whiskey.flavorNames[i])) {
                        acc += count;
                    }
                    return acc;
                }, 0);
            });

            const flavorsChart = li.querySelector('canvas').getContext('2d');
            const gradient = flavorsChart.createLinearGradient(20, 0, 220, 0);
            gradient.addColorStop(0, '#f12711');
            gradient.addColorStop(.7, '#f5af19');
            // gradient.addColorStop(1, '#0F2027');

            // eslint-disable-next-line
            let chart = new Chart(flavorsChart, {
                type: 'radar',
                data: {
                    labels: chartCategories,
                    datasets: [{
                        label: 'Flavor Profile',
                        backgroundColor: gradient,
                        tension: .8,
                        radius: 1,
                        borderWidth: 1,
                        data: chartMagnitudes,
                    }]
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scale: {
                        ticks: {
                            display: false,
                        }
                    }
                }
            });

        }

        if(flavorCategories) {
            createChart(flavorCategories, whiskey);        
        }
    }

    renderHTML() {
        const whiskey = this.props.whiskey;
        const starClass = whiskey.isFavorite ? 'is-favorite' : '';

        return /*html*/`
        <li class="whiskey-items">
            <div class="title-container">
                <i class="material-icons favorite-star star ${starClass}">star</i>
                <h2 class="whiskey-title">${whiskey.title}</h2>
            </div>
            <div class="img-container">
                <img class="list-img" src="${whiskey.detail_img_url}" alt=""/>
                <div className="details-container">
                    <p class="details"><span class="whiskey-details">Region:</span> ${whiskey.region}</p>
                    <p class="details"><span class="whiskey-details">Rating:</span> ${whiskey.rating}</p>
                    <p class="details"><span class="whiskey-details">Price:</span> $${whiskey.price} /bottle</p>
                    <p class="details"><span class="whiskey-details">Flavors:</span> ${whiskey.flavor_1}, ${whiskey.flavor_2}, ${whiskey.flavor_3}, ${whiskey.flavor_4}, ${whiskey.flavor_5}</p>
                </div>
                <div class="chart-container">
                    <canvas></canvas>
                </div>
            </div>
        </li>
        `;
    }
}

export default WhiskeyItem;