// Demo
// 1. Basic modal
const modal1Btn = document.querySelector('.js-popzy-modal-1');

const modal1 = new Popzy({
    content: `<h2>Basic modal</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, architecto! Perspiciatis eveniet quia cum suscipit asperiores voluptate minima repudiandae corrupti.</p>`,
});

modal1Btn.addEventListener('click', () => {
    modal1.open();
});

// 2. Modal with Buttons
const modal2Btn = document.querySelector('.js-popzy-modal-2');

const modal2 = new Popzy({
    content: `<h2>Modal with Buttons</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, architecto! Perspiciatis eveniet quia cum suscipit asperiores voluptate minima repudiandae corrupti.</p>`,
    footer: true,
});

modal2Btn.addEventListener('click', () => {
    modal2.open();
});

modal2.addFooterButton('Cancel', 'modal-btn', () => {
    modal2.close();
});

modal2.addFooterButton('Confirm', 'modal-btn primary', () => {
    // Logic user confirm...
    modal2.close();
});

// 3. Large Content Modal
const modal3Btn = document.querySelector('.js-popzy-modal-3');

const modal3 = new Popzy({
    content: `<h2>Large Content Modal</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, blanditiis optio. Sapiente distinctio, voluptatum voluptate excepturi, recusandae libero earum dolores quisquam quae commodi quasi veniam nesciunt velit beatae adipisci repudiandae assumenda atque, odio explicabo optio. Iure qui laboriosam nulla saepe impedit quisquam quia? Mollitia architecto, ea, voluptate sint doloremque odio facere molestias repellendus, accusamus labore facilis reprehenderit vero voluptatibus quis doloribus ex. Eum quo perspiciatis neque cum. Quam natus similique facere quas, provident porro temporibus fuga? Possimus perspiciatis accusamus provident temporibus aspernatur molestiae aliquam voluptatem consequatur assumenda eaque rem necessitatibus reprehenderit fugit voluptate, ut ducimus laboriosam recusandae ex illo deserunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, blanditiis optio. Sapiente distinctio, voluptatum voluptate excepturi, recusandae libero earum dolores quisquam quae commodi quasi veniam nesciunt velit beatae adipisci repudiandae assumenda atque, odio explicabo optio. Iure qui laboriosam nulla saepe impedit quisquam quia? Mollitia architecto, ea, voluptate sint doloremque odio facere molestias repellendus, accusamus labore facilis reprehenderit vero voluptatibus quis doloribus ex. Eum quo perspiciatis neque cum. Quam natus similique facere quas, provident porro temporibus fuga? Possimus perspiciatis accusamus provident temporibus aspernatur molestiae aliquam voluptatem consequatur assumenda eaque rem necessitatibus reprehenderit fugit voluptate, ut ducimus laboriosam recusandae ex illo deserunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, blanditiis optio. Sapiente distinctio, voluptatum voluptate excepturi, recusandae libero earum dolores quisquam quae commodi quasi veniam nesciunt velit beatae adipisci repudiandae assumenda atque, odio explicabo optio. Iure qui laboriosam nulla saepe impedit quisquam quia? Mollitia architecto, ea, voluptate sint doloremque odio facere molestias repellendus, accusamus labore facilis reprehenderit vero voluptatibus quis doloribus ex. Eum quo perspiciatis neque cum. Quam natus similique facere quas, provident porro temporibus fuga? Possimus perspiciatis accusamus provident temporibus aspernatur molestiae aliquam voluptatem consequatur assumenda eaque rem necessitatibus reprehenderit fugit voluptate, ut ducimus laboriosam recusandae ex illo deserunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, blanditiis optio. Sapiente distinctio, voluptatum voluptate excepturi, recusandae libero earum dolores quisquam quae commodi quasi veniam nesciunt velit beatae adipisci repudiandae assumenda atque, odio explicabo optio. Iure qui laboriosam nulla saepe impedit quisquam quia? Mollitia architecto, ea, voluptate sint doloremque odio facere molestias repellendus, accusamus labore facilis reprehenderit vero voluptatibus quis doloribus ex. Eum quo perspiciatis neque cum. Quam natus similique facere quas, provident porro temporibus fuga? Possimus perspiciatis accusamus provident temporibus aspernatur molestiae aliquam voluptatem consequatur assumenda eaque rem necessitatibus reprehenderit fugit voluptate, ut ducimus laboriosam recusandae ex illo deserunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, blanditiis optio. Sapiente distinctio, voluptatum voluptate excepturi, recusandae libero earum dolores quisquam quae commodi quasi veniam nesciunt velit beatae adipisci repudiandae assumenda atque, odio explicabo optio. Iure qui laboriosam nulla saepe impedit quisquam quia? Mollitia architecto, ea, voluptate sint doloremque odio facere molestias repellendus, accusamus labore facilis reprehenderit vero voluptatibus quis doloribus ex. Eum quo perspiciatis neque cum. Quam natus similique facere quas, provident porro temporibus fuga? Possimus perspiciatis accusamus provident temporibus aspernatur molestiae aliquam voluptatem consequatur assumenda eaque rem necessitatibus reprehenderit fugit voluptate, ut ducimus laboriosam recusandae ex illo deserunt!</p>`,
});

modal3Btn.addEventListener('click', () => {
    modal3.open();
});

// 5. Footer-Only Close Modal
const modal5Btn = document.querySelector('.js-popzy-modal-5');

const modal5 = new Popzy({
    content: `<h2>Footer-Only Close Modal</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, architecto! Perspiciatis eveniet quia cum suscipit asperiores voluptate minima repudiandae corrupti.</p>`,
    closeMethods: [],
    footer: true,
});

modal5Btn.addEventListener('click', () => {
    modal5.open();
});

modal5.addFooterButton('Agree and continue', 'modal-btn primary', () => {
    modal5.close();
});

// 6. Persistent Modal (Stays in DOM)
const modal6Btn = document.querySelector('.js-popzy-modal-6');

const modal6 = new Popzy({
    content: `<h2>Persistent Modal (Stays in DOM)</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, architecto! Perspiciatis eveniet quia cum suscipit asperiores voluptate minima repudiandae corrupti.</p>`,
    destroyOnClose: false,
});

modal6Btn.addEventListener('click', () => {
    modal6.open();
});

// 7. Multiple Modals
const modal7Btn = document.querySelector('.js-popzy-modal-7');

const modal7 = new Popzy({
    content: `<h2>Multiple Modals</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, architecto! Perspiciatis eveniet quia cum suscipit asperiores voluptate minima repudiandae corrupti.</p>`,
    footer: true,
});

modal7Btn.addEventListener('click', () => {
    modal7.open();
});

modal7.addFooterButton('Open Basic Modal', 'modal-btn', () => {
    modal1.open();
});

// 4. YouTube embed Modal
const modal4Btn = document.querySelector('.js-popzy-modal-4');

const modal4 = new Popzy({
    content: `<iframe width="560" height="315" src="https://www.youtube.com/embed/amhu7cJyKF8?si=Rn6Yfh7vJAKBmlht" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
});

modal4Btn.addEventListener('click', () => {
    modal4.open();
});
