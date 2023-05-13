# Motivational Poster

Motivational Poster is a simple web application that displays a random motivational quote or joke over a random background image. Users can download the currently displayed image if they like it.

## Setup

1. Clone this repository:

```bash
git clone https://github.com/yourusername/motivational-poster.git
cd motivational-poster
```

2. Install dependencies:

```bash
npm install
```

3. Build the Docker image:

```bash
docker-compose build
```

## Usage

1. Start the application:

```bash
docker-compose up
```

2. Open a web browser and navigate to http://localhost:5353.

3. Enjoy the motivational quotes and beautiful images!

## Customization

You can customize the quotes and images used by the application:

- To use your own quotes, replace the `sayings.txt` file with a text file of your own. Each line in the file should be a different quote.

- To use your own images, replace the `images` directory with a directory of your own. The directory should contain your image files (in .jpg or .png format).

When you run the Docker container, it will use your custom quotes and images.

## License

This project is licensed under the MIT License - see the LICENSE file for details.