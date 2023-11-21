## Description

Project created on [Nest](https://github.com/nestjs/nest) framework.

<p align="center">
  <a href="https://nestjs.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-plain.svg" alt="nestjs" width="40" height="40"/> </a>  <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a>  <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>
</p>

This backend serves as the foundation for a website dedicated to sharing wish list.

The ```admin``` section is designed for the administrator, displaying their wishes on the website. The ```client-items``` segment is meant to handle requests from the user's frontend.

```Item``` model is utilized to represent each wish.

Here's an example of how could such table look like for user:
| **Chosen** | **Precious gift**              | **Approximate price** | **Description**                                                           | **Links** | **Priority** |
|:----------:|--------------------------------|:---------------------:|---------------------------------------------------------------------------|-----------|--------------|
| ☐          | 16GB USB Stick                 | 5€ - 30€              | 16GB or more, USB 3.0, with a preference for a sleek, dark-colored design | [Link to one of the possibilities](https://www.samsung.com/lv/memory-storage/usb-flash-drive/usb-flash-drive-fit-plus-128gb-muf-128ab-apc/)||
| ☑          | Soup Plate	                    | 10€ - 100€            | smooth, with an enchanting coloring or a unique pattern                   | [Example](https://www.iittala.com/en-lv/tableware/plates-and-bowls/bowls/taika-bowl-28l26cm-blue-1006017), [Another example](https://www.iittala.com/en-lv/tableware/all-tableware/all-tableware-items/teema-plate-deep-21cm-vintage-blue-1061238)||
| ☐          | Leather Gloves                 | 20€ - 50€             | opt for a masculine model with a refined, simple style                    |           ||


## Installation

```bash
$ npm install

# if you don't have nest cli
$ npm install -g @nestjs/cli
```

## Running the app

### For development

```bash
# launch database container
$ docker compose up -d lobsterlist-postgres

# deploy migrations
$ npx prisma migrate deploy

# generate prisma resources
$ npx prisma generate

# development
$ npm run start

# watch mode
$ npm run start:dev
```

### For production

```bash
# launch database container
$ docker compose up -d lobsterlist-postgres

# deploy migrations
$ npx prisma migrate deploy

# stop database container to make some further changes
$ docker stop lobsterlist-postgres
```
In the ```.env``` file change ```DATABASE_URL``` to URL with container name (```lobsterlist-postgres```).

In the ```docker-compose.yml``` you can remove ```ports``` section it becomes unnecessary.

```bash
# launch database container again
$ docker compose up -d lobsterlist-postgres

# build backend container
$ docker compose build lobsterlist-back

# launch backend container
$ docker compose up -d lobsterlist-back
```

The backend container is reachable on exposed port - ```3021```. Feel free to change port in the ```docker-compose.yml``` file.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints

| HTTP method | URL | Path variables | Body | Description |
|:---:| --- | --- | --- | --- |
| POST | /admin/items | - | JSON<br> <pre>{<br>  title: string;<br>  description?: string;<br>  priceFrom: number;<br>  priceTo?: number;<br>  links?: [{<br>    href: string;<br>    description?: string;<br>  }];<br>}</pre> | Create new Item. |
| POST | /admin/items/multiple | - | JSON<br> <pre>{<br>  data: [{<br>    title: string;<br>    description?: string;<br>    priceFrom: number;<br>    priceTo?: number;<br>    links?: [{<br>      href: string;<br>      description?: string;<br>    }];<br>  }]<br>}</pre> | Create multiple new Items from data array. |
| GET | /admin/items | - | - | Get all Items. Ordered by ```priority``` field. |
| PATCH | /admin/items/:id | id: number | JSON<br> <pre>{<br>  priority: number;<br>}</pre> | Update Item's ```priority``` value. |
| DELETE | /admin/items/:id | id: number | - | Delete Item by ```id```.<br> Unlike others URL, response is in format:<br> <pre>{<br>  id: number;<br>}</pre> |
| POST | /client-items | - | JSON<br> <pre>{<br>  title?: "asc" &#124; "desc";<br>  priceFrom?: "asc" &#124; "desc";<br>  priority?: "asc" &#124; "desc";<br>  ticked?: "asc" &#124; "desc";<br>}</pre> | Get all Items ordered by user specified sorting fields. |
| PATCH | /client-items/:id | id: number | JSON<br> <pre>{<br>  ticked: boolean;<br>  tickedBy?: string;<br>}</pre> | Update Item's ```ticked``` field's value and modify related fields (```tickedAt``` and ```tickedBy```). |

## Support

If you wanna support my coding crimes, I would always appreciate your [investment in my tea](https://www.paypal.com/donate/?hosted_button_id=YBLWNJ376T8Y8).

## License

MIT licensed
