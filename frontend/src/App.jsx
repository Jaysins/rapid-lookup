import { useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { useGetCatalogue, useGetCountries } from "./api/main";
import { Card, CardBody } from "@nextui-org/react";
import { format } from 'date-fns';

const continents = [
  {
    name: 'Africa',
    id: 'africa'
  },
  {
    name: 'Asia',
    id: 'asia'
  },
  {
    name: 'Europe',
    id: 'europe'
  },
  {
    name: 'North America',
    id: 'north america'
  },
  {
    name: 'South America',
    id: 'south america'
  },
  {
    name: 'Australia',
    id: 'australia'
  },
  {
    name: 'Antarctica',
    id: 'antarctica'
  }
];

export default function App() {
  const [continent, setContinent] = useState();
  const [country, setCountry] = useState();
  const { data: { results: countries = [] } = {}, isLoading: isCountriesLoading } = useGetCountries(continent);
  const { data: { results: catalogues = [] } = {}, isLoading: isCatalogueLoading } = useGetCatalogue(country);

  return (
    <>
      <div className="container max-w-xl mx-auto py-10">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Continent"
            variant="bordered"
            placeholder="Select a continent"
            selectedKeys={ continent ? [continent] : [] }
            onSelectionChange={ (e) => {
              if (e.size) setContinent(Array.from(e)[0]);
            } }
          >
            { continents.map((c) => (
              <SelectItem key={ c.id } value={ c.id } classNames={ { title: 'text-base' } }>
                { c.name }
              </SelectItem>
            )) }
          </Select>
          <Select
            label="Select country"
            variant="bordered"
            selectedKeys={ country ? [country] : [] }
            onSelectionChange={ (e) => {
              if (e.size) setCountry(Array.from(e)[0]);
            } }
            isLoading={ isCountriesLoading }
          >
            {
              countries.map(c => (
                <SelectItem
                  key={ c.id }
                  startContent={ <Avatar alt={ c.name } className="w-6 h-6" src={ c.flag } /> }
                  classNames={ { title: 'text-base' } }
                >
                  { c.name }
                </SelectItem>
              ))
            }
          </Select>
        </div>

        <div className="mt-10">
          {
            isCatalogueLoading ? (
              <p className="opacity-70">Fetching catalogue...</p>
            ) : (
              <div className="space-y-4">
                {
                  catalogues?.map(item => (
                    <Card key={item.id} as="a" href={ item.url } target="_blank" shadow="none" className="border border-gray-300 hover:bg-gray-100">
                      <CardBody className="px-5">
                        <h3 className="font-medium">{ item.title }</h3>
                        <div className="flex items-center justify-between mt-1">
                          <p><span className="opacity-70">Publisher:</span> { item.publisher }</p>
                          <p className="opacity-60">{ format(new Date(item.publishedDate), 'do, MMM, yyyy') }</p>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}
