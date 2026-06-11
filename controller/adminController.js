const Admin = require("../model/model_Admin");
const fs = require("fs");
const path = require("path");

class AdminController {
    static async listarProdutos(req, res) {

  try {

    const produtos =
      await Admin.listarProdutos();

    res.json(produtos);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao listar produtos"
    });

  }

}

static async adicionarProduto(req, res) {

  try {

    const {
      nome,
      descricao,
      preco,
      categoria
    } = req.body;

    // Converter preço para número decimal
    const precoNumerico = parseFloat(preco);

    if (isNaN(precoNumerico) || precoNumerico < 0) {
      return res.status(400).json({
        erro: "Preço inválido. Use um número decimal válido (ex: 30.50)"
      });
    }

    const imagem =
      req.files?.imagem
        ? "/uploads/" + req.files.imagem[0].filename
        : null;

    const imagem2 =
      req.files?.imagem2
        ? "/uploads/" + req.files.imagem2[0].filename
        : null;

    const imagem3 =
      req.files?.imagem3
        ? "/uploads/" + req.files.imagem3[0].filename
        : null;

    await Admin.adicionarProduto(
      nome,
      descricao,
      precoNumerico,
      imagem,
      imagem2,
      imagem3,
      categoria
    );

    res.send("Produto adicionado");

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao adicionar produto"
    });

  }
}

  static async listarPedidos(req, res) {

    try {

      const pedidos =
        await Admin.listarPedidos();

      res.json(pedidos);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        erro: "Erro ao listar pedidos"
      });

    }

  }

  static async excluirProduto(req, res) {

    try {

      const { id } = req.params;

      // Buscar o produto para obter as imagens
      const produto = await Admin.buscarProdutoPorId(id);

      if (!produto) {
        return res.status(404).json({
          erro: "Produto não encontrado"
        });
      }

      // Remover as imagens do servidor
      const imagens = [produto.imagem, produto.imagem2, produto.imagem3];
      
      imagens.forEach(imagem => {
        if (imagem) {
          // Remove o prefixo "/uploads/" do caminho se existir
          const nomeArquivo = imagem.replace(/^\/uploads\//, "");
          const caminhoArquivo = path.join(
            __dirname,
            "..",
            "uploads",
            nomeArquivo
          );
          
          if (fs.existsSync(caminhoArquivo)) {
            fs.unlinkSync(caminhoArquivo);
            console.log(`Imagem deletada: ${caminhoArquivo}`);
          }
        }
      });

      // Deletar o produto do banco
      const result = await Admin.excluirProduto(id);

      if (result.rowCount === 0) {
        return res.status(404).json({
          erro: "Erro ao deletar produto do banco"
        });
      }

      res.json({
        mensagem: "Produto e imagens excluídos com sucesso"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        erro: "Erro ao excluir produto"
      });

    }

  }

  static async editarProduto(
  req,
  res
){

  try{

    const { id } =
      req.params;

    const {
      nome,
      descricao,
      preco,
      categoria
    } = req.body;

    // Converter preço para número decimal
    const precoNumerico = parseFloat(preco);

    if (isNaN(precoNumerico) || precoNumerico < 0) {
      return res.status(400).json({
        erro: "Preço inválido. Use um número decimal válido (ex: 30.50)"
      });
    }

    // Buscar produto atual para obter imagens antigas
    const produtoAtual = await Admin.buscarProdutoPorId(id);

    if(!produtoAtual){
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    // Processar imagens - usar nova se enviada, senão manter a antiga
    let imagem = produtoAtual.imagem;
    let imagem2 = produtoAtual.imagem2;
    let imagem3 = produtoAtual.imagem3;

    // Imagem 1
    if(req.files?.imagem && req.files.imagem[0]){
      const novaImagem = "/uploads/" + req.files.imagem[0].filename;
      
      // Deletar imagem antiga se existir
      if(produtoAtual.imagem){
        const nomeArquivo = produtoAtual.imagem.replace(/^\/uploads\//, "");
        const caminhoArquivo = path.join(__dirname, "..", "uploads", nomeArquivo);
        
        if(fs.existsSync(caminhoArquivo)){
          fs.unlinkSync(caminhoArquivo);
          console.log(`Imagem 1 antiga deletada: ${caminhoArquivo}`);
        }
      }
      
      imagem = novaImagem;
    }

    // Imagem 2
    if(req.files?.imagem2 && req.files.imagem2[0]){
      const novaImagem2 = "/uploads/" + req.files.imagem2[0].filename;
      
      // Deletar imagem antiga se existir
      if(produtoAtual.imagem2){
        const nomeArquivo = produtoAtual.imagem2.replace(/^\/uploads\//, "");
        const caminhoArquivo = path.join(__dirname, "..", "uploads", nomeArquivo);
        
        if(fs.existsSync(caminhoArquivo)){
          fs.unlinkSync(caminhoArquivo);
          console.log(`Imagem 2 antiga deletada: ${caminhoArquivo}`);
        }
      }
      
      imagem2 = novaImagem2;
    }

    // Imagem 3
    if(req.files?.imagem3 && req.files.imagem3[0]){
      const novaImagem3 = "/uploads/" + req.files.imagem3[0].filename;
      
      // Deletar imagem antiga se existir
      if(produtoAtual.imagem3){
        const nomeArquivo = produtoAtual.imagem3.replace(/^\/uploads\//, "");
        const caminhoArquivo = path.join(__dirname, "..", "uploads", nomeArquivo);
        
        if(fs.existsSync(caminhoArquivo)){
          fs.unlinkSync(caminhoArquivo);
          console.log(`Imagem 3 antiga deletada: ${caminhoArquivo}`);
        }
      }
      
      imagem3 = novaImagem3;
    }

    const result =
      await Admin.editarProduto(
        id,
        nome,
        descricao,
        precoNumerico,
        imagem,
        imagem2,
        imagem3,
        categoria
      );

    res.json({
      mensagem:
      "Produto atualizado com sucesso"
    });

  }
  catch(err){

    console.log(err);

    res.status(500).json({
      erro:
      "Erro ao atualizar produto"
    });

  }

}

  static async atualizarStatus(req, res) {

    try {

      const { id } = req.params;
      let { status } = req.body;

      status = status.trim().toLowerCase();

      await Admin.atualizarStatus(
        id,
        status
      );

      res.json({
        mensagem: "Status atualizado com sucesso"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        erro: "Erro ao atualizar status"
      });

    }

  }

}

module.exports = AdminController;