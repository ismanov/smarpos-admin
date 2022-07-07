import AuthRepository from "./auth/index";
import BranchRepository from "app/businessLogicLayer/repo/branch";
import ResourcesRepository from "app/businessLogicLayer/repo/resources";
import ClientRepository from "app/businessLogicLayer/repo/client";
import ChequeRepository from "app/businessLogicLayer/repo/cheque";
import OwnerRepository from "app/businessLogicLayer/repo/owner";
import ProductRepository from "app/businessLogicLayer/repo/product";
import ExciseRepository from "app/businessLogicLayer/repo/excise";
import VatRepository from "app/businessLogicLayer/repo/vat";
import KKMRepository from "app/businessLogicLayer/repo/kkm";
import SupplierRepository from "app/businessLogicLayer/repo/supplier";
import UserRepository from "app/businessLogicLayer/repo/users";
import UnitsRepository from "app/businessLogicLayer/repo/units";
import AnalyticsRepository from "app/businessLogicLayer/repo/analytics";
import SingleRepository from 'app/businessLogicLayer/repo/single';
import LogRepository from 'app/businessLogicLayer/repo/log';
import PermissionsRepository from 'app/businessLogicLayer/repo/permissions';
import DataEntryRepository from 'app/businessLogicLayer/repo/dataEntry';
import ServiceRepository from 'app/businessLogicLayer/repo/service';
import TelegramAccountRepository from 'app/businessLogicLayer/repo/telegramAccount';
import PaymentRepo from "./payment";

export default {
  auth: new AuthRepository(),
  analytics: new AnalyticsRepository(),
  branch: new BranchRepository(),
  resources: new ResourcesRepository(),
  client: new ClientRepository(),
  cheque: new ChequeRepository(),
  owner: new OwnerRepository(),
  product: new ProductRepository(),
  excise: new ExciseRepository(),
  vat: new VatRepository(),
  kkm: new KKMRepository(),
  supplier: new SupplierRepository(),
  user: new UserRepository(),
  units: new UnitsRepository(),
  single: new SingleRepository(),
  log: new LogRepository(),
  permissions: new PermissionsRepository(),
  dataEntry: new DataEntryRepository(),
  service: new ServiceRepository(),
  telegramAccount: new TelegramAccountRepository(),
  payment: new PaymentRepo(),
};
